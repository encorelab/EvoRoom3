/*jslint devel: true, regexp: true, browser: true, unparam: true, debug: true, sloppy: true, sub: true, es5: true, vars: true, evil: true, fragment: true, eqeq: false, plusplus: true, nomen: false, white: false */
/*globals Sail, Rollcall, $, window, _ */

var EvoRoom = window.EvoRoom || {};
EvoRoom.Teacher = {
    rollcallURL: '/rollcall',
    
    users: {},
    
    init: function() {
        Sail.app.rollcall = new Rollcall.Client(Sail.app.rollcallURL);
        
        Sail.app.run = Sail.app.run || JSON.parse($.cookie('run'));
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
            Sail.app.rollcall.request(Sail.app.rollcall.url + "/runs/"+Sail.app.run.name+"/users.json", 
                    "GET", {}, function(data) {
                EvoRoom.Teacher.users = {};
                _.each(data, function(u) {
                    if (u.user.kind === 'Student') {
                        EvoRoom.Teacher.gotUpdatedUserData(u.user);
                    } else {
                        console.log("Ignoring non-student "+u.user.account.login);
                    }
                });
            });
        },
    
        connected: function(ev) {
            $("#teacher-dashboard-day-1").css('visibility', 'visible');
            EvoRoom.Teacher.bindEventTriggers();
            
            Sail.app.groupchat.addParticipantJoinedHandler(function(who, stanza) {
                var match = who.match(/\/(\w*)/);
                console.log(who + " joined...");
                if (match && match[1]) {
                    var username = match[1];
                    Sail.app.rollcall.request(Sail.app.rollcall.url + "/users/"+username+".json", 
                            "GET", {}, function(data) {
                        if (data.user.kind === 'Student') {
                            EvoRoom.Teacher.gotUpdatedUserData(data.user);
                        } else {
                            console.log("Ignoring non-student "+username);
                        }
                    });
                }
            });
        },
    
        unauthenticated: function(ev) {
            Sail.app.authenticate();
        },
        
        sail: {
            orient: function(sev) {
                $('button[value="'+sev.payload.time_period+'"]').addClass('teacher-button-done');
            },
            
            observations_start: function(sev) {
                if (sev.payload.rotation === 1) {
                    $('.step-1-2 button.start_rotation_1')
                        .addClass('teacher-button-done')  
                        .addClass('teacher-button-faded');
                        //.attr('disabled','disabled');
                        
                    $('.indicator.step-1-2').addClass('done')
                        .prevAll().addClass('done');
                } else {
                    $('.step-1-4 button.start_rotation_2')
                        .addClass('teacher-button-done')  
                        .addClass('teacher-button-faded');
                        //.attr('disabled','disabled');
                    $('.indicator.step-1-4').addClass('done')
                        .prevAll().addClass('done');
                }
            },
            
            homework_assignment: function(sev) {
                if (sev.payload.day === 1) {
                    $('.step-1-6 button.assign_homework_1')
                        .addClass('teacher-button-done')
                        .addClass('teacher-button-faded');
                        //.attr('disabled','disabled');
                    $('.indicator.step-1-6').addClass('done')
                        .prevAll().addClass('done');
                } //else {
                     // TODO
                //}
            },
            
            state_change: function(sev) {
                EvoRoom.Teacher.gotUpdatedUserState(sev.origin, sev.payload.to);
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
    
    gotUpdatedUserData: function(user) {
        if (!EvoRoom.Teacher.users) {
            EvoRoom.Teacher.users = {};
        }
        
        var username = user.account.login;
        var state = user.metadata.state;
        EvoRoom.Teacher.users[username] = user;
        
        EvoRoom.Teacher.gotUpdatedUserState(username, state || "OUTSIDE");
    },
    
    gotUpdatedUserState: function(username, state) {
        if (!EvoRoom.Teacher.users) {
            EvoRoom.Teacher.users = {};
        }
        
        if (!EvoRoom.Teacher.users[username]) {
            EvoRoom.Teacher.users[username] = {account: {login: username}, metadata: {state: state}};
        } else {
            EvoRoom.Teacher.users[username]['metadata']['state'] = state;
        }
        
        var user = EvoRoom.Teacher.users[username];
        
        if (user.metadata.current_rotation != 2 && EvoRoom.Teacher.checkAllUsersInState('ORIENTATION')) {
            $('.step-1-2 button.start_rotation_1').removeClass('teacher-button-faded');
            $('.step-1-2 button.start_rotation_1').addClass('teacher-button-primed');
        } else {
            $('.step-1-2 button.start_rotation_1').removeClass('teacher-button-primed');
        }
        
        if (user.metadata.current_rotation == 2 && EvoRoom.Teacher.checkAllUsersInState('WAITING_FOR_GROUP_TO_FINISH_MEETUP')) {
            $('.step-1-4 button.start_rotation_2').removeClass('teacher-button-faded');
            $('.step-1-4 button.start_rotation_2').addClass('teacher-button-primed');
        } else {
            $('.step-1-4 button.start_rotation_2').removeClass('teacher-button-primed');
        }
        
        if (user.metadata.current_rotation == 2 && EvoRoom.Teacher.checkAllUsersInState('WAITING_FOR_GROUP_TO_FINISH_MEETUP')) {
            $('.step-1-6 button.assign_homework_1').removeClass('teacher-button-faded');
            $('.step-1-6 button.assign_homework_1').addClass('teacher-button-primed');
        } else {
            $('.step-1-6 button.assign_homework_1').removeClass('teacher-button-primed');
        }
        
        var marker = EvoRoom.Teacher.studentMarker(username);
        switch (state) {
            case "OUTSIDE":
                $('.step-1-0 .students').append(marker);
                break;
            case "ORIENTATION":
                $('.step-1-1 .students').append(marker);
                break;
            case "OBSERVING_PAST":
                if (user.metadata.current_rotation == 1) {
                    $('.step-1-2 .students').append(marker);
                } else if (user.metadata.current_rotation == 2) {
                    $('.step-1-4 .students').append(marker);
                }
                break;
            case "MEETUP":
            case "WAITING_FOR_MEETUP_START":
            case "WAITING_FOR_GROUP_TO_FINISH_MEETUP":
                if (user.metadata.current_rotation == 1) {
                    $('.step-1-3 .students').append(marker);
                } else {
                    $('.step-1-5 .students').append(marker);
                }
                break;
            case "OUTSIDE":
                if (user.metadata.current_rotation == 2) {
                    $('.step-1-6 .students').append(marker);
                }
                break;
        }
    },
    
    checkAllUsers: function(check) {
        return _.all(EvoRoom.Teacher.users, function(user, username) {
            return check(username, user);
        });
    },
    
    checkAllUsersInState: function(state) {
        return EvoRoom.Teacher.checkAllUsers(function(username,user) { return user.metadata.state === state; });
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
            var sev = new Sail.Event('homework_assignment', {day: 1});
            Sail.app.groupchat.sendEvent(sev);
        });
    },
    
    studentMarker: function(username) {
        var marker = $('#'+username);
        
        if (marker.length < 1) {
            marker = $("<span class='student' id='"+username+"'>"+username+"</span>");
        }
        
        var userUpdate = function(data) {
            marker.addClass('team-'+data.user.groups[0].name);
        };
        Sail.app.rollcall.request(Sail.app.rollcall.url+'/users/'+username+'.json', 'GET', {}, userUpdate);
        
        return marker;
    }
};