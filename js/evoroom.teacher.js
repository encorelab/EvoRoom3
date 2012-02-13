/*jslint devel: true, regexp: true, browser: true, unparam: true, debug: true, sloppy: true, sub: true, es5: true, vars: true, evil: true, fragment: true, plusplus: true, nomen: true, white: false, eqeq: false */
/*globals Sail, Rollcall, $, window */

var EvoRoom = window.EvoRoom || {};
EvoRoom.Teacher = {
    rollcallURL: '/rollcall',
    
    currentRotation: 0,
    
    init: function() {
        Sail.app.rollcall = new Rollcall.Client(Sail.app.rollcallURL);
        
        if (Sail.app.run) {
            Sail.app.groupchatRoom = Sail.app.run.name + '@conference.' + Sail.app.xmppDomain;
        }
        
        Sail.modules
            .load('Rollcall.Authenticator', {
                mode: 'username-and-password', 
                askForRun: true, 
                curnit: 'EvoRoom3',
                usersQuery: {},
                userFilter: function(u) {return u.kind === "Instructor";}
            })
            .load('Strophe.AutoConnector')
            .load('AuthStatusWidget')
            .thenRun(function () {
                Sail.autobindEvents(EvoRoom.Teacher);
                
                $(document).ready(function() {
                    $('#reload').click(function() {
                        Sail.Strophe.disconnect();
                        location.reload();
                    });
                });
                
                $(Sail.app).trigger('initialized');
                return true;
            });
    },
    
    events: {
        initialized: function(ev) {
            Sail.app.authenticate();
        },
    
        authenticated: function(ev) {
            
        },
    
        connected: function(ev) {
            $("#teacher-dashboard-day-1").css('visibility', 'visible');
            EvoRoom.Teacher.bindEventTriggers();
        },
    
        unauthenticated: function(ev) {
            Rollcall.Authenticator.requestRun();
        },
        
        sail: {
            orient: function(sev) {
                $('button[value="'+sev.payload.time_period+'"]').addClass('teacher-button-done');
            },
            
            observations_start: function(sev) {
                if (sev.payload.rotation === 1) {
                    EvoRoom.Teacher.currentRotation = 1;
                    $('.step-1-2 button.start_rotation_1')
                        .addClass('teacher-button-done')                    
                        .attr('disabled','disabled');
                        
                    $('.indicator.step-1-2').addClass('done')
                        .prevAll().addClass('done')
                } else {
                    EvoRoom.Teacher.currentRotation = 2;
                    $('.step-1-4 button.start_rotation_2')
                        .addClass('teacher-button-done')                    
                        .attr('disabled','disabled');
                    $('.indicator.step-1-4').addClass('done')
                        .prevAll().addClass('done')
                }
            },
            
            homework_assigned: function(sev) {
                if (sev.payload.day === 1) {
                    $('.step-1-6 button.assign_homework_1')
                        .addClass('teacher-button-done')                    
                        .attr('disabled','disabled');
                    $('.indicator.step-1-6').addClass('done')
                        .prevAll().addClass('done')
                } //else {
                     // TODO
                //}
            },
            
            state_change: function(sev) {
                marker = EvoRoom.Teacher.studentMarker(sev.origin)
                switch (sev.payload.to) {
                    case "ORIENTATION":
                        $('.step-1-1 .students').append(marker)
                        break;
                    case "OBSERVING_PAST":
                        if (EvoRoom.Teacher.currentRotation == 1)
                            $('.step-1-2 .students').append(marker)
                        else if (EvoRoom.Teacher.currentRotation == 2)
                            $('.step-1-4 .students').append(marker)
                        break;
                    case "WAITING_FOR_MEETUP_START":
                        if (EvoRoom.Teacher.currentRotation == 1)
                            $('.step-1-3 .students').append(marker)
                        else
                            $('.step-1-5 .students').append(marker)
                        break;
                    case "OUTSIDE":
                        if (EvoRoom.Teacher.currentRotation == 2)
                            $('.step-1-6 .students').append(marker)
                        break;
                }
            }
        }
    },
    
    
    authenticate: function() {
        Sail.app.token = Sail.app.rollcall.getCurrentToken();

        if (!Sail.app.run) {
            Rollcall.Authenticator.requestRun();
        } else if (!Sail.app.token) {
            Rollcall.Authenticator.requestLogin();
        } else {
            Sail.app.rollcall.fetchSessionForToken(Sail.app.token, function(data) {
                    Sail.app.session = data.session;
                    $(Sail.app).trigger('authenticated');
                },
                function(error) {
                    console.warn("Token '"+Sail.app.token+"' is invalid. Will try to re-authenticate...");
                    Rollcall.Authenticator.unauthenticate();
                }
            );
        }
    },
    
    
    bindEventTriggers: function() {
        $('.step-1-1 .buttons button').each(function() {
            var val = $(this).val();
            $(this).click(function() {
                var sev = new Sail.Event('orient', {
                    time_period: val
                });
                Sail.app.groupchat.sendEvent(sev);
            });
        });
        
        $('.step-1-2 .start_rotation_1').click(function () {
            var sev = new Sail.Event('observations_start', {rotation: 1});
            Sail.app.groupchat.sendEvent(sev);
        });
        
        $('.step-1-4 .start_rotation_2').click(function () {
            var sev = new Sail.Event('observations_start', {rotation: 2});
            Sail.app.groupchat.sendEvent(sev);
        });
        
        $('.step-1-6 .assign_homework_1').click(function () {
            var sev = new Sail.Event('homework_assigned', {day: 1});
            Sail.app.groupchat.sendEvent(sev);
        });
    },
    
    studentMarker: function(username) {
        var marker = $('#'+username);
        
        if (marker.length < 1) {
            marker = $("<span class='student' id='"+username+"'>"+username+"</span>");
        }
        
        var userUpdate = function(data) {
            marker.addClass('team-'+data.user.groups[0].name)
        };
        Sail.app.rollcall.request(Sail.app.rollcall.url+'/users/'+username+'.json', 'GET', {}, userUpdate);
        
        
        return marker;
    }
};