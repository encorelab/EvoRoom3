/*jslint devel: true, regexp: true, browser: true, unparam: true, debug: true, sloppy: true, sub: true, es5: true, vars: true, evil: true, fragment: true, eqeq: false, plusplus: true, nomen: false, white: false */
/*globals Sail, Rollcall, $, window, _ */

var EvoRoom = window.EvoRoom || {};
EvoRoom.Teacher = {
    rollcallURL: '/rollcall',
    
    users: {},
    done_features: {},
    
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
            $(".teacher-dashboard").css('visibility', 'visible');
            EvoRoom.Teacher.bindEventTriggers();
            
            Sail.app.groupchat.addParticipantJoinedHandler(function(who, stanza) {
                var match = who.match(/\/(\w*)/);
                console.log(who + " joined...");
                if (match && match[1]) {
                    var username = match[1];
                    EvoRoom.Teacher.refreshDataForUser(username);
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
            },
            
            notes_completion: function(sev) {
                EvoRoom.Teacher.done_features[sev.origin] = true;
            },
            
            transition_animation: function(sev) {
                $('button.start_pre_transition').removeClass('teacher-button-primed');
                
                $('button.start_transition').addClass('teacher-button-primed');
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
    
    refreshDataForUser: function(username) {
        console.log("requesting data refresh for: ", username);
        Sail.app.rollcall.request(Sail.app.rollcall.url + "/users/"+username+".json", 
                "GET", {}, function(data) {
            if (data.user.kind === 'Student') {
                EvoRoom.Teacher.gotUpdatedUserData(data.user);
            } else {
                console.log("Ignoring non-student "+username);
            }
        });
    },
    
    gotUpdatedUserData: function(user) {
        if (!EvoRoom.Teacher.users) {
            EvoRoom.Teacher.users = {};
        }
        
        var username = user.account.login;
        var state = user.metadata.state || "OUTSIDE";
        
        console.log("got updated data for: ", username, user);
        
        EvoRoom.Teacher.users[username] = user;
        
        var marker = EvoRoom.Teacher.studentMarker(user);
        marker.attr('title', state + " ("+user.metadata.current_rotation+")");
        
        if (user.metadata.day == 2) { // day 2
            if (EvoRoom.Teacher.checkAllUsersInState('ORIENTATION')) {
                $('.step-2-2 button.start_feature_observations').removeClass('teacher-button-faded');
                $('.step-2-2 button.start_feature_observations').addClass('teacher-button-primed');
            } else {
                $('.step-2-2 button.start_feature_observations').removeClass('teacher-button-primed');
            }
            
            if (_.all(EvoRoom.Teacher.users, function(user, username) {return EvoRoom.Teacher.done_features[username] === true} )
                    && EvoRoom.Teacher.checkAllUsersInState('OBSERVING_PAST_FEATURES')) {
                $('button.start_pre_transition').removeClass('teacher-button-faded');
                $('button.start_pre_transition').addClass('teacher-button-primed');
                $('button.start_transition').removeClass('teacher-button-faded');
            } else {
                $('button.start_pre_transition').removeClass('teacher-button-primed');
                $('button.start_transition').removeClass('teacher-button-primed');
            }
            
            if (EvoRoom.Teacher.checkAllUsersInState('BRAINSTORMING')) {
                $('.step-2-5 .buttons button').removeClass('teacher-button-faded');
                $('.assign_homework_2').removeClass('teacher-button-faded');
            }
            
            switch (state) {
                case "OUTSIDE":
                    $('.step-2-0 .students').append(marker);
                    break;
                case "ORIENTATION":
                    $('.step-2-1 .students').append(marker);
                    break;
                case "OBSERVING_PAST_FEATURES":
                    if (EvoRoom.Teacher.done_features[username] === true) {
                        $('.step-2-3 .students').append(marker);
                    } else {
                        $('.step-2-2 .students').append(marker);
                    }
                    break;
                case "OBSERVING_PRESENT":
                    $('.step-2-4 .students').append(marker);
                    break;
               case 'BRAINSTORMING':
                    $('.step-2-5 .students').append(marker);
                    break;
                case 'DONE':
                    $('.step-2-6 .students').append(marker);
                    break;
            }
            
            // end of day 2
        } else { // day 1
        
            if (EvoRoom.Teacher.checkAllUsersInRotation(1) && EvoRoom.Teacher.checkAllUsersInState('ORIENTATION')) {
                $('.step-1-2 button.start_rotation_1').removeClass('teacher-button-faded');
                $('.step-1-2 button.start_rotation_1').addClass('teacher-button-primed');
            } else {
                $('.step-1-2 button.start_rotation_1').removeClass('teacher-button-primed');
            }
        
            if (EvoRoom.Teacher.checkAllUsersInRotation(1) && EvoRoom.Teacher.checkAllUsersInState('WAITING_FOR_GROUP_TO_FINISH_MEETUP')) {
                $('.step-1-4 button.start_rotation_2').removeClass('teacher-button-faded');
                $('.step-1-4 button.start_rotation_2').addClass('teacher-button-primed');
            } else {
                $('.step-1-4 button.start_rotation_2').removeClass('teacher-button-primed');
            }
        
            if (EvoRoom.Teacher.checkAllUsersInRotation(2) && EvoRoom.Teacher.checkAllUsersInState('WAITING_FOR_GROUP_TO_FINISH_MEETUP')) {
                $('.step-1-6 button.assign_homework_1').removeClass('teacher-button-faded');
                $('.step-1-6 button.assign_homework_1').addClass('teacher-button-primed');
            } else {
                $('.step-1-6 button.assign_homework_1').removeClass('teacher-button-primed');
            }
        
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
                case 'WAITING_FOR_LOCATION_ASSIGNMENT':
                case 'GOING_TO_ASSIGNED_LOCATION':
                    switch(user.metadata.current_task) {
                        case 'meetup':
                            if (user.metadata.current_rotation == 1) {
                                $('.step-1-3 .students').append(marker);
                            } else {
                                $('.step-1-5 .students').append(marker);
                            }
                            break;
                        case 'observe_past_presence':
                            if (user.metadata.current_rotation == 1) {
                                $('.step-1-2 .students').append(marker);
                            } else {
                                $('.step-1-4 .students').append(marker);
                            }
                            break;
                    }
                    break;
            }
            
            // end of day 1
        }
        
        $('#'+username).effect("highlight", {}, 800);
        //$('.student').after(" "); // FIXME: hack -- inserts too many spaces right now, but needed for white-space wrap
    },
    
    gotUpdatedUserState: function(username, state) {
        console.log("got updated state for: ", username, state);
        EvoRoom.Teacher.refreshDataForUser(username);
    },
    
    checkAllUsers: function(check) {
        return _.all(EvoRoom.Teacher.users, function(user, username) {
            return check(username, user);
        });
    },
    
    checkAllUsersInState: function(state) {
        var check = function(username,user) { return user.metadata.state === state; };
        return EvoRoom.Teacher.checkAllUsers(check);
    },
    
    checkAllUsersInRotation: function(rotation) {
        var check = function(username,user) { 
            if (rotation == 1) {
                return !user.metadata.current_rotation || user.metadata.current_rotation == rotation; 
            } else {
                return user.metadata.current_rotation == rotation; 
            }
        };
        return EvoRoom.Teacher.checkAllUsers(check);
    },
    
    bindEventTriggers: function() {
        $('.step-1-1 .buttons button, .step-2-5 .buttons button').each(function() {
            var val = $(this).val();
            $(this).click(function() {
                var sev = new Sail.Event('orient', {
                    time_period: val
                });
                Sail.app.groupchat.sendEvent(sev);
            });
        });
        
        $('.start_rotation_1').click(function () {
            var sev = new Sail.Event('observations_start', {rotation: 1});
            Sail.app.groupchat.sendEvent(sev);
        });
        
        $('.start_rotation_2').click(function () {
            var sev = new Sail.Event('observations_start', {rotation: 2});
            Sail.app.groupchat.sendEvent(sev);
        });
        
        $('.assign_homework_1').click(function () {
            var sev = new Sail.Event('homework_assignment', {day: 1});
            Sail.app.groupchat.sendEvent(sev);
        });
        
        
        // day 2
        
        $('.start_feature_observations').click(function () {
            var sev = new Sail.Event('feature_observations_start', {});
            Sail.app.groupchat.sendEvent(sev);
        });
        
        $('.start_pre_transition').click(function () {
            var sev = new Sail.Event('transition_animation', {});
            Sail.app.groupchat.sendEvent(sev);
        });
        
        $('.start_transition').click(function () {
            var sev = new Sail.Event('transition_to_present', {});
            Sail.app.groupchat.sendEvent(sev);
        });
        
        $('.assign_homework_2').click(function () {
            var sev = new Sail.Event('homework_assignment', {day: 1});
            Sail.app.groupchat.sendEvent(sev);
        });
    },
    
    studentMarker: function(user) {
        var username = user.account.login;
        var state = user.metadata.state;
        var marker = $('#'+username);
        
        if (marker.length < 1) {
            marker = $("<span class='student' id='"+username+"' title='"+state+"'>"+username+"</span>");
        }
        
        if (user.groups && user.groups[0]) {
            var teamName = user.groups[0].name;
            if (teamName) {
                marker.addClass('team-'+teamName);
            }
        } else {
            EvoRoom.Teacher.refreshDataForUser(username);
        }
        
        return marker;
    },
};