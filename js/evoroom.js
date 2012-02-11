/*jslint devel: true, regexp: true, browser: true, unparam: true, debug: true, sloppy: true, sub: true, es5: true, vars: true, evil: true, fragment: true, plusplus: true, nomen: true, white: true, eqeq: false */
/*globals Sail, Rollcall, $, Foo, _, window */

var EvoRoom = {
    user_metadata: null,
    rotation: null,
    currentTeam: null,
    assignedLocation: null,
    currentLocation: null,
    selectedOrganism: null,
    buttonRevealCounter: 0,

    // TODO fill this
    ancestors: {
        "proboscis_monkey":["ant","civet","fig_wasp","none"],
        "white_fronted_langur":["white_fronted_langur","white_fronted_langur","white_fronted_langur","none"],
        "muellers_gibbon":["civet","fig_wasp","white_fronted_langur","none"]
        },


    rollcallURL: '/rollcall',

    events: {
        sail: {
            /********************************************* INCOMING EVENTS *******************************************/
            observations_start: function(ev) {
                if (ev.payload.rotation) {
                    // show the question assigned to this student
                    if (ev.payload.rotation === 1 || ev.payload.rotation === 2) {
                        EvoRoom.rotation = ev.payload.rotation;
                        console.log("rotation " + EvoRoom.rotation);

                        // set the progress indicator to the correct indication
                        /*if (EvoRoom.rotation === 1) {
                            //EvoRoom.indicateProgressStage(2);
                        } else if (EvoRoom.rotation === 2) {
                            //EvoRoom.indicateProgressStage(4);
                        }*/
                    }
                    else {
                        alert("Wrong rotation received. Please ask teacher to send again.");
                    }
                }
                else {
                    console.log("rotation_start event received, but payload is incomplete or not for this user");
                }
            },
            
            location_assignment: function(ev) {
                if (ev.payload.location && ev.payload.username === Sail.app.session.account.login) {
                    // hide all pages
                    Sail.app.hidePageElements();
                    // sanity check
                    if (ev.payload.location === "station_a" || ev.payload.location === "station_b"
                        || ev.payload.location === "station_c" || ev.payload.location === "station_d"
                        || ev.payload.location === "borneo" ||ev.payload.location === "sumatra") {
                            // store assigned location
                            EvoRoom.assignedLocation = ev.payload.location;
                            // show assigned location in DOM
                            $('#go-to-location .current-location').text(EvoRoom.formatLocationString(EvoRoom.assignedLocation));
                            // show page
                            $('#go-to-location').show();
                    }
                    else {
                        console.error("Error, wrong location " + ev.payload.location + " received. Log in again!");
                    }
                    $('#go-to-location').show();
                }
                else {
                    console.log("location_assignment event received, but payload is incomplete or not for this user");
                }
            },
                       
            topic_assignment: function(ev) {
                if (ev.payload.topic && ev.payload.tags && ev.payload.username === Sail.app.session.account.login) {
                    Sail.app.hidePageElements();
                    $('#meetup .topic').text(ev.payload.topic);
                    Sail.app.tagsArray = ev.payload.tags;
                    $('#meetup-instructions').show();
                }
                else {
                    console.log("topic_assignment event received, but payload is incomplete or not for this user");
                }
            },
            
            homework_assignment: function(ev) {
                if (EvoRoom.user_metadata.day === "2" && ev.payload) {
                    Sail.app.hidePageElements();
                    $('#day2-complete').show();
                } else if (ev.payload) {
                    Sail.app.hidePageElements();
                    $('#day1-complete').show();
                } else {
                    console.log("homework_assignment event received, but payload is incomplete or not for this user");
                }
            }
        },

        initialized: function(ev) {
            // Sail.app.hidePageElements();
            Sail.app.authenticate();
        },

        authenticated: function(ev) {

        },

        connected: function(ev) {
            Sail.app.rollcall.request(Sail.app.rollcall.url + "/users/"+Sail.app.session.account.login+".json", "GET", {}, function(data) {
                EvoRoom.currentTeam = data.user.groups[0].name;
                EvoRoom.user_metadata = data.user.metadata;
                
                // try to fill rotation from metadata
                EvoRoom.rotation = parseInt(data.user.metadata.current_rotation, 10);
                // fill the location variables
                EvoRoom.currentLocation = Sail.app.user_metadata.currently_assigned_location;
                EvoRoom.assignedLocation = Sail.app.user_metadata.current_location;
                
                console.log('metadata assigned');
                EvoRoom.setupPageLayout();
                EvoRoom.restoreState(); 
            });
        },

        unauthenticated: function(ev) {
            EvoRoom.user_metadata = null;
            EvoRoom.rotation = null;
            EvoRoom.currentTeam = null;
            EvoRoom.assignedLocation = null;
            EvoRoom.currentLocation = null;
            
            EvoRoom.hidePageElements();
            
            Rollcall.Authenticator.requestRun();
        }
    },

    init: function() {
        Sail.app.rollcall = new Rollcall.Client(Sail.app.rollcallURL);

        Sail.app.run = Sail.app.run || JSON.parse($.cookie('run'));
        if (Sail.app.run) {
            Sail.app.groupchatRoom = Sail.app.run.name + '@conference.' + Sail.app.xmppDomain;
        }

        Sail.modules
        .load('Rollcall.Authenticator', {mode: 'picker', askForRun: true, curnit: 'EvoRoom', userFilter: function(u) {return true; /*u.kind == "Student"*/}})
        .load('Strophe.AutoConnector')
        .load('AuthStatusWidget')
        .thenRun(function () {
            Sail.autobindEvents(EvoRoom);

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

    hidePageElements: function() {
        $('#loading-page').hide();
        $('#log-in-success').hide();
        $('#room-scan-failure').hide();
        $('#team-assignment').hide();
        $('#organism-assignment').hide();
        $('#go-to-location').hide();
        $('#location-scan-failure').hide();
        $('#observe-organisms-instructions').hide();
        $('#observe-organisms').hide();
        $('#is-organism-present').hide();
        $('#ancestor-information').hide();
        $('#ancestor-information-details').hide();
        $('#choose-ancestor').hide();
        $('#team-meeting').hide();
        $('#meetup-instructions').hide();
        $('#meetup').hide();
        $('#day1-complete').hide();
        
        $('#log-in-success-day2').hide();
        $('#team-organism-assignment-day2').hide();
        $('#2mya-instructions').hide();
        $('#2mya-choose-organisms').hide();
        $('#2mya-organism-details').hide();
        $('#transition').hide();
        $('#present-day-instructions').hide();
        $('#present-day-organisms').hide();
        $('#concepts-instructions').hide();
        $('#concepts-discussion').hide();


    },

    setupPageLayout: function() {
        // using each() now to iterate over the members and creating div's on the fly
        Sail.app.rollcall.request(Sail.app.rollcall.url + "/groups/" + Sail.app.currentTeam + ".json", "GET", {}, function(data) {
            _.each(data.group.members, function(member) {
                // create a new div object
                var memberDiv = $('<div />');
                // assign the needed classes
                memberDiv.addClass('team-members');
                memberDiv.addClass('orange');
                memberDiv.addClass('indent');
                // insert the username to be displayed
                memberDiv.text(member.user.display_name);
                // add the div to the members div
                $('#team-assignment .members').append(memberDiv);
            });
        });
        // set up display of team name on 'team assignment' page for day one and the 'team-organism-assignment-day2' for day 2
        $('.team-name').text(Sail.app.currentTeam);
        
        // set up display of organisms on 'organism assignment' page for day one and the 'team-organism-assignment-day2' for day 2
        var j = 0;
        var organismArray = Sail.app.getCurrentStudentOrganisms();
        while (j < organismArray.length) {
            j++;
            $('#organism-assignment .assigned-organism-'+j).text(Sail.app.formatOrganismString(organismArray[j-1]));
            $('#team-organism-assignment-day2 .assigned-organism-'+j).text(Sail.app.formatOrganismString(organismArray[j-1]));
        }

        $('.jquery-radios').buttonset();
        
        // check which day it is
        if (EvoRoom.user_metadata.day === "2") {
            $('#log-in-success-day2').show();
        }
        else { 
            $('#log-in-success').show();
        }

        $('#log-in-success .big-button').click(function() {
            // check if barcodeScanner is possible (won't be outside of PhoneGap app)
            if (window.plugins.barcodeScanner) {
                console.log('window.plugins.barcodeScanner available');
                // trigger the QR scan screen/module to scan room entry
                window.plugins.barcodeScanner.scan(Sail.app.barcodeScanRoomLoginSuccess, Sail.app.barcodeScanRoomLoginFailure);
            } else {
                console.log('window.plugins.barcodeScanner NOT available');
                // trigger the error handler to get alternative
                Sail.app.barcodeScanRoomLoginFailure('No scanner, probably desktop browser');
            }
        });
        
        // register on-click listeners for room QR code scanning error resolution               // ARMIN, I've added the day 2 thing here, but it's different than the others... but I think it's right
        $('#room-scan-failure .big-button').click(function() {
            // hide everything
            Sail.app.hidePageElements();
            if (EvoRoom.user_metadata.day === "2") {
                $('#team-organism-assignment-day2').show();
            }
            else { 
                $('#log-in-success').show();
            }
        });

        $('#room-scan-failure .big-error-resolver-button').click(function() {
            // don't need to trigger, just call the function
            Sail.app.barcodeScanRoomLoginSuccess('room');
        });
        
        $('#team-assignment .small-button').click(function() {
            Sail.app.hidePageElements();
            $('#organism-assignment').show();
            //$('#observe-organisms-instructions').show();
            //Sail.app.currentLocation = "station_a"; // only for testing... REMOVE
            //Sail.app.rotation = 1;
            // I switch these around for testing purposes... the first one is the 'correct' one
        });
        
        $('#go-to-location .big-button').click(function() {
            // check if barcodeScanner is possible (won't be outside of PhoneGap app)
            if (window.plugins.barcodeScanner) {
                // trigger the QR scan screen/module to scan room entry
                window.plugins.barcodeScanner.scan(Sail.app.barcodeScanLocationSuccess, Sail.app.barcodeScanLocationFailure);
            } else {
                // trigger the error handler to get alternative
                Sail.app.barcodeScanLocationFailure('No scanner, probably desktop browser');
            }
        });
        
        // on-click listeners for rainforest QR scanning error resolution
        $('#location-scan-failure .big-button').click(function() {
            // hide everything
            Sail.app.hidePageElements();
            // show go-to-location page
            $('#go-to-location').show();
        });

        $('#location-scan-failure .small-error-resolver-button').click(function() {
            // call success function and hand in location from clicked button
            Sail.app.barcodeScanLocationSuccess($(this).data('location'));
        });
        
        $('#observe-organisms-instructions .small-button').click(function() {
            Sail.app.hidePageElements();
            
            // set up the year on each page that needs it
            $('#observe-organisms .year').text(Sail.app.calculateYear());
            $('#is-organism-present .year').text(Sail.app.calculateYear());
            $('#ancestor-information .year').text(Sail.app.calculateYear());
            $('#ancestor-information-details .year').text(Sail.app.calculateYear());
            $('#choose-ancestor .year').text(Sail.app.calculateYear());
            
            // set up organism table for next screen
            Sail.app.setupOrganismTable();

            $('#observe-organisms').show();
        });
        
/*        $('#observe-organisms .organism-table-button').click(function() {
            Sail.app.hidePageElements();
            
            $('#student-chosen-organisms .chosen-organism-image').attr('src', '/images/' + Sail.app.selectedOrganism + '_icon.png');
            $('#student-chosen-organisms').show();
            $('.chosen-organism').text(Sail.app.formatOrganismString(Sail.app.selectedOrganism));
            $('#is-organism-present').show();
        });
*/        
        // on-click listeners for rainforest QR scanning error resolution
        $('#observe-organisms .small-button').click(function() {
            Sail.app.hidePageElements();
            $('#loading-page').show();
        });
        
        $('#is-organism-present .small-button').click(function() {
            Sail.app.hidePageElements();

            if ($('#org-choice-yes').is(':checked')) {
                $('#student-chosen-organisms').hide();
                
                // both params are the same in this case
                Sail.app.submitOrganismObservation(Sail.app.selectedOrganism, Sail.app.selectedOrganism);
                // clear radio buttons
                $('input:radio').prop('checked', false);
                $('#is-organism-present .radio').button('refresh');
                
                $('#observe-organisms').show();
            }
            else {
                // clear radio buttons
                $('input:radio').prop('checked', false);
                $('#is-organism-present .radio').button('refresh');
                
                //$('#observe-organisms .organism1').attr('src', '/images/' + Sail.app.user_metadata.assigned_organism_1 + '_icon.png');
                //$('#observe-organisms .text1').text(Sail.app.formatOrganismString(Sail.app.user_metadata.assigned_organism_1));
                // TODO what is this stuff above... also make the below dynamic
                Sail.app.setupAncestorTable(Sail.app.selectedOrganism, "partial");
                $('#ancestor-information').show();
            }
        });
        
        $('#ancestor-information .small-button').click(function() {
            Sail.app.hidePageElements();
            Sail.app.setupAncestorTable(Sail.app.selectedOrganism, "full");
            $('#choose-ancestor').show();
        });
        
        $('#ancestor-information-details .small-button').click(function() {
            Sail.app.hidePageElements();
            $('#ancestor-information').show();
        });

/* ====================================== MEETUP =================================== */

        $('#meetup-instructions .small-button').click(function() {
            Sail.app.hidePageElements();
            $('#meetup').show();
        });
        
        $('#meetup .small-button').click(function() {
            Sail.app.hidePageElements();
            Sail.app.submitNote();
            
            // clear text in preparation for rotation 2
            $('#meetup .meetup-text-entry').val('');
            $('#loading-page').show();
        });
///////////////////////////////////////////////////////////////////////////////////////
/* ====================================== DAY 2 ==================================== */
///////////////////////////////////////////////////////////////////////////////////////

        
        $('#log-in-success-day2 .big-button').click(function() {
            // check if barcodeScanner is possible (won't be outside of PhoneGap app)
            if (window.plugins.barcodeScanner) {
                console.log('window.plugins.barcodeScanner available');
                // trigger the QR scan screen/module to scan room entry
                window.plugins.barcodeScanner.scan(Sail.app.barcodeScanRoomLoginSuccess, Sail.app.barcodeScanRoomLoginFailure);
            } else {
                console.log('window.plugins.barcodeScanner NOT available');
                // trigger the error handler to get alternative
                Sail.app.barcodeScanRoomLoginFailure('No scanner, probably desktop browser');
            }
        });
        
        $('#team-organism-assignment-day2 .small-button').click(function() {
            Sail.app.hidePageElements();
            $('#2mya-instructions').show();
        });
        
        $('#2mya-instructions .small-button').click(function() {
            Sail.app.hidePageElements();
            
            EvoRoom.setupOrganismTable();
            $('#2mya-choose-organisms').show();
        });
        
        $('#2mya-organism-details .small-button').click(function() {
            Sail.app.hidePageElements();
            
            Sail.app.submitOrganismFeatures();
            
            // clear text entry field
            $('#2mya-organism-details .2mya-organism-details-text-entry').val('');
            $('#2mya-choose-organisms').show();
        });
        
        $('#2mya-choose-organisms .small-button').click(function() {
            Sail.app.hidePageElements();
            
            Sail.app.submitNotesCompletion();
            
            // for testing, first is correct, comment out everything else
            $('#transition').show();
            //Sail.app.currentLocation = "station_a";
            //$('#present-day-instructions').show();
            //$('#concepts-instructions').show();
        });
    
        /* ====================================== PRESENT DAY =================================== */
    
        $('#present-day-instructions .small-button').click(function() {
            Sail.app.hidePageElements();
            
            Sail.app.setupPresentDayTable();
            
            if (Sail.app.currentLocation === "station_a" || Sail.app.currentLocation === "station_b") {
                $('#present-day-organisms .location').text('Borneo');
            }
            else if (Sail.app.currentLocation === "station_c" || Sail.app.currentLocation === "station_d") {
                $('#present-day-organisms .location').text('Sumatra');
            }
            else {
                console.log("currentLocation has not been set");
            }
            // ensure done button is hidden
            $('#present-day-organisms .small-button').hide();
            // reset all yes/no button pairs
            $('#present-day-organisms .presence-choice').each(function (index) {
                $(this).removeClass('ui-state-highlight');
                // set yes/no in data-choice attribute of tr
                $(this).parent().parent().attr('data-choice', "none");
            });
            
            $('#present-day-organisms').show();
        });
        
        $('#present-day-organisms .small-button').click(function() {
            // create observation_table object for message observation_tabulation
            var observation_table = {};
            $('#present-day-organisms .present-day-organisms-table tr').each(function (index) {
                observation_table[$(this).attr('data-organism')] = $(this).attr('data-choice');
            });
            // hide everything
            Sail.app.hidePageElements();
            
            // send out observation_tabulation
            EvoRoom.submitObservationTabulation(observation_table);
            
            // clear all radio buttons
            //$('input:radio').prop('checked', false);
            //$('#present-day-organisms .radio').button('refresh');
            
            $('#loading-page').show();
        });
        
        $('#present-day-organisms .presence-choice').click(function() {
            // highlight the chosen button
            $(this).addClass('ui-state-highlight');
            // set yes/no in data-choice attribute of tr
            $(this).parent().parent().attr('data-choice', $(this).text());
            // take highlighting away from other button
            $(this).siblings().removeClass('ui-state-highlight');
            // check if done button should be displayed
            var displayDone = true;
            $('#present-day-organisms .present-day-organisms-table tr').each(function (index) {
                // not all data-choice attributes are filled, so don't display done button
                if ($(this).attr('data-choice') === "none") {
                    displayDone = false;
                    return false;
                }
            });
            // show button if all choices are made
            if (displayDone) {
                $('#present-day-organisms .small-button').show();
            }
        });
        
        $('#concepts-instructions .small-button').click(function() {
            Sail.app.hidePageElements();
            $('#concepts-discussion').show();
        });
        
        $('#concepts-discussion .small-button').click(function() {
            EvoRoom.submitConceptDiscussion();
            alert('Your data has been submitted');
            
            Sail.app.hidePageElements();
            // clear fields, reload the page
            $('#concepts-discussion .evolution-concept-dropdown').val('');
            $('#concepts-discussion .concepts-discussion-text-entry').val('');
            $('#concepts-discussion').show();
        });
        
    },

    /********************************************* OUTGOING EVENTS *******************************************/

    submitCheckIn: function() {
        var sev = new Sail.Event('check_in', {
            team_name:Sail.app.currentTeam,
            location:Sail.app.currentLocation
        });
        
        // one off event handler which is set during the sending of check_in message
        var stateChangeHandler = function (sev) {
            if (sev.payload.to) {
                console.log('Caught oneoff event stateChangeHandler with to = ' + sev.payload.to);
                
                if (sev.payload.to === 'OBSERVING_IN_ROTATION') {
                    Sail.app.hidePageElements();
                    $('#observe-organisms-instructions').show();
                } else if (sev.payload.to === 'WAITING_FOR_MEETUP_TOPIC') {
                    // something will happen here ;)
                    //EvoRoom.indicateProgressStage(3);
                    $('#team-meeting').show();
                } else if (sev.payload.to === 'OBSERVING_PRESENT') {
                    // this is Day 2 Step 3: Present day!
                    $('#present-day-instructions').show();
                } else if (sev.payload.to === 'BRAINSTORMING') {
                    $('#concepts-instructions').show();
                } else {
                    console.warn('Caught state_change event with one-off handler, but nobody seems to care. From: ' +sev.payload.from+ 'To: ' + sev.payload.to);
                }
            } else {
                console.warn('Caught oneoff event stateChangeHandler with EMPTY to field');
            }
        };
        
        // create state change handler if checkin is not in room
        // eventHandlerFunction, eventType, origin (user), payload,
        if (EvoRoom.currentLocation === 'room') {
            //EvoRoom.indicateProgressStage(1);
            console.log('sumbitCheckIn for room');
        } else {
            Sail.app.groupchat.addOneoffEventHandler(stateChangeHandler, 'state_change', Sail.app.session.account.login);
            console.log('Set up one-off event handler for state_change in check_in');
        }
        
        Sail.app.groupchat.sendEvent(sev);
    },

    submitOrganismObservation: function(observedOrganism, assignedOrganism) {
        var sev = new Sail.Event('organism_observation', {
            team_name:Sail.app.currentTeam,
            assigned_organism:assignedOrganism,
            observed_organism:observedOrganism,
            location:EvoRoom.currentLocation,
            time:Sail.app.calculateYear()
        });
        Sail.app.groupchat.sendEvent(sev);
    },
    
    submitNote: function() {
        var sev = new Sail.Event('note', {
            author:Sail.app.session.account.login,
            team_name:Sail.app.currentTeam,
            meetup:Sail.app.rotation,
            note:$('#meetup .meetup-text-entry').val(),
            specialty:"TODO"
        });
        EvoRoom.groupchat.sendEvent(sev);
    },
    
    submitOrganismFeatures: function() {
        var sev = new Sail.Event('organism_features', {
            team_name:Sail.app.currentTeam,
            author:Sail.app.session.account.login,
            organism:Sail.app.selectedOrganism,
            explanation:$('#2mya-organism-details .2mya-organism-details-text-entry').val()
        });
        EvoRoom.groupchat.sendEvent(sev);
    },
    
    submitNotesCompletion: function() {
        var sev = new Sail.Event('notes_completion', {
            // empty?
        });
        EvoRoom.groupchat.sendEvent(sev);
    },
    
    submitObservationTabulation: function(observations_table) {
        var sev = new Sail.Event('observation_tabulation', {
            team_name:Sail.app.currentTeam,
            location:Sail.app.currentLocation,
            organism_presence:observations_table
        });
        EvoRoom.groupchat.sendEvent(sev);
    },
    
    submitConceptDiscussion: function() {
        var sev = new Sail.Event('concept_discussion', {
            author:Sail.app.session.account.login,
            concept:$('select.evolution-concept-dropdown').val(),
            time:"TODO",
            organism:"TODO",
            explanation:$('#concepts-discussion .concepts-discussion-text-entry').val()
        });
        EvoRoom.groupchat.sendEvent(sev);
    },


    /****************************************** HELPER FUNCTIONS *************************************/

    restoreState: function() {
        Sail.app.hidePageElements();
        if (!Sail.app.user_metadata.state || Sail.app.user_metadata.state === 'LOGGED_IN') {
            if (EvoRoom.user_metadata.day === "2") {
                $('#log-in-success-day2').show();
            }
            else { 
                $('#log-in-success').show();
            }
        } else if (Sail.app.user_metadata.state === 'ORIENTATION') {
            //EvoRoom.indicateProgressStage(1);
            // show the wait for teacher thing
            $('#team-assignment').show();
        } else if (Sail.app.user_metadata.state === 'WAITING_FOR_LOCATION_ASSIGNMENT') {
            //EvoRoom.indicateProgressStage(2);
            // show the wait for teacher thing
            $('#loading-page').show();
        } else if (Sail.app.user_metadata.state === 'GOING_TO_ASSIGNED_LOCATION') {
            $('#go-to-location .current-location').text(EvoRoom.formatLocationString(EvoRoom.assignedLocation));
            //EvoRoom.indicateProgressStage(2);
            // show screen to scan in location
            $('#go-to-location').show();
        } else if (Sail.app.user_metadata.state === 'OBSERVING_PAST') {
            //EvoRoom.indicateProgressStage(2);
            $('#observe-organisms-instructions').show();
        } else if (Sail.app.user_metadata.state === 'WAITING_FOR_MEETUP_TOPIC') {
            //EvoRoom.indicateProgressStage(3);
            $('#team-meeting').show();
        } else if (Sail.app.user_metadata.state === 'MEETUP') {
            //EvoRoom.indicateProgressStage(3);
            if (Sail.app.user_metadata.topic && Sail.app.user_metadata.tags) {
                $('#meetup .topic').text(Sail.app.user_metadata.topic);
                Sail.app.tagsArray = Sail.app.user_metadata.tags;
                // show the meetup page
                $('#meetup-instructions').show();
            } else {
                console.warn('restoreState: state MEETUP but either topic or tags was empty');
                alert('restoreState: state MEETUP but either topic or tags was empty');
            }
        } else if (Sail.app.user_metadata.state === 'COMPLETED_DAY_1') {
            $('#day1-complete').show();
        } else if (Sail.app.user_metadata.state === 'OBSERVING_PRESENT') {
            // this is Day 2 Step 3: Present day!
            $('#present-day-instructions').show(); 
        } else if (Sail.app.user_metadata.state === 'BRAINSTORMING') {
            // this is Day 2 Step 4: Concepts aka Brainstorming
            $('#concepts-instructions').show();
        } else if (Sail.app.user_metadata.state === 'DONE') {
            $('#day2-complete').show();
        } else {
            console.warn('restoreState: read state <'+Sail.app.user_metadata.state+ '> which is not handled currently.');
        }
    },
    
    barcodeScanRoomLoginSuccess: function(result) {
        console.log("Got Barcode: " +result);
        // check if checkin to room
        if (result === "room") {
            // send out event check_in
            Sail.app.currentLocation = result;
            Sail.app.submitCheckIn();
            // hide everything
            Sail.app.hidePageElements();
        
            // check which day it is
            if (EvoRoom.user_metadata.day === "2") {
                $('#team-organism-assignment-day2').show();
            }
            else { 
                // show waiting for teacher page
                $('#team-assignment').show();
            }
        } else {
            console.log("Expected scan result 'room' but received: '" + result + "'");
            $('#room-scan-failure').show();
        }
    },

    barcodeScanRoomLoginFailure: function(msg) {
        console.warn("SCAN FAILED: "+msg);
        // hide everything
        Sail.app.hidePageElements();
        $('#room-scan-failure').show();
    },

    barcodeScanLocationSuccess: function(result) {
        console.log("Got Barcode: " +result);
        // send out event check_in
        EvoRoom.currentLocation = result;
        if (EvoRoom.currentLocation === EvoRoom.assignedLocation) {
            Sail.app.submitCheckIn();
            // hide everything
            Sail.app.hidePageElements();
            // show waiting page
            $('#loading-page').show();
        } else {
            alert("You scanned location " + EvoRoom.formatLocationString(EvoRoom.currentLocation) + " instead of " + EvoRoom.formatLocationString(EvoRoom.assignedLocation));
            // hide everything
            Sail.app.hidePageElements();
            // back to scanning again
            $('#go-to-location').show();
        }
    },

    barcodeScanLocationFailure: function(msg) {
        console.warn("SCAN FAILED: "+msg);
        // hide everything
        Sail.app.hidePageElements();
        $('#location-scan-failure').show();
    },
    
    barcodeScanFinalPicksSuccess: function(result) {
        console.log("Got Barcode: " +result);
        // send out event check_in
        Sail.app.currentLocation = result;
        Sail.app.submitCheckIn();
        // hide everything
        Sail.app.hidePageElements();
        // show waiting page
        $('#final-picks-debrief').show();
    },
    
    
    getCurrentStudentOrganisms: function() {
        return JSON.parse(Sail.app.user_metadata['assigned_organisms']);
    },
    
    calculateYear: function() {
        if (Sail.app.rotation === 1) {
            if (Sail.app.currentLocation === "station_a") {
                return "200 mya";
            }
            else if (Sail.app.currentLocation === "station_b") {
                return "150 mya";
            }
            else if (Sail.app.currentLocation === "station_c") {
                return "100 mya";
            }
            else if (Sail.app.currentLocation === "station_d") {
                return "50 mya";
            }
            else {
                console.log("year or station strings are missing, can't calculate year");
                return "unknown time";
            }
        }
        else if (Sail.app.rotation === 2) {
            if (Sail.app.currentLocation === "station_a") {
                return "25 mya";
            }
            else if (Sail.app.currentLocation === "station_b") {
                return "10 mya";
            }
            else if (Sail.app.currentLocation === "station_c") {
                return "5 mya";
            }
            else if (Sail.app.currentLocation === "station_d") {
                return "2 mya";
            }
            else {
                console.log("year or station strings are missing, can't calculate year");
                return "unknown time";
            }
        }
        else {
            console.log("rotation undefined, can't calculate year");
            return "unknown time";
        }
    },
    
    formatLocationString: function(locationString) {
        if (locationString === "station_a") {
            return "Station A";
        } else if (locationString === "station_b") {
            return "Station B";
        } else if (locationString === "station_c") {
            return "Station C";
        } else if (locationString === "station_d") {
            return "Station D";
        } else if (locationString === "room") {
            console.warn('Location ' + locationString + ' is wrong at this point. Inform user with alert!');
            alert("An error has occured. Please talk to a teacher");
        } else {
            console.warn('Location ' + locationString + ' is wrong at this point and we return <unknown rainforest>');
            return "unknown rainforest";
        }
    },
    
    formatStringToBoolean: function(radioString) {
        if (radioString === "true") {
            return true;
        } else {
            return false;
        }
    },
    
    formatOrganismString: function(organismString) {
        if (organismString === "ant") {
            return "Ant";
        } else if (organismString === "blue_headed_pitta") {
            return "Blue headed pitta";
        } else if (organismString === "bornean_orangutan") {
            return "Bornean orangutan";
        } else if (organismString === "borneo_porcupine") {
            return "Borneo porcupine";
        } else if (organismString === "civet") {
            return "Civet";
        } else if (organismString === "clouded_leopard") {
            return "Clouded leopard";
        } else if (organismString === "common_porcupine") {
            return "Common porcupine";
        } else if (organismString === "fig_tree") {
            return "Fig tree";
        } else if (organismString === "fig_wasp") {
            return "Fig wasp";
        } else if (organismString === "forest_durian") {
            return "Forest durian";
        } else if (organismString === "garnet_pitta") {
            return "Garnet pitta";
        } else if (organismString === "ginger") {
            return "Ginger";
        } else if (organismString === "helmeted_hornbill") {
            return "Helmeted hornbill";
        } else if (organismString === "jambu_tree") {
            return "Jambu tree";
        } else if (organismString === "leopard_cat") {
            return "Leopard cat";
        } else if (organismString === "malabar_grey_hornbill") {
            return "Malabar grey hornbill";
        } else if (organismString === "meggaris_tree") {
            return "Meggaris tree";
        } else if (organismString === "mitered_leaf_monkey") {
            return "Mitered leaf monkey";
        } else if (organismString === "muellers_gibbon") {
            return "Mueller's gibbon";
        } else if (organismString === "pangolin") {
            return "Pangolin";
        } else if (organismString === "pheasant") {
            return "Pheasant";
        } else if (organismString === "pitcher_plant") {
            return "Pitcher plant";
        } else if (organismString === "proboscis_monkey") {
            return "Proboscis monkey";
        } else if (organismString === "rafflesia") {
            return "Rafflesia";
        } else if (organismString === "rhinoceros_hornbill") {
            return "Rhinoceros hornbill";
        } else if (organismString === "sumatran_orangutan") {
            return "Sumatran orangutan";
        } else if (organismString === "sumatran_rhinoceros") {
            return "Sumatran rhinoceros";
        } else if (organismString === "sumatran_striped rabbit") {
            return "Sumatran striped rabbit";
        } else if (organismString === "sumatran_tiger") {
            return "Sumatran tiger ";
        } else if (organismString === "sunda_pangolin") {
            return "Sunda pangolin";
        } else if (organismString === "termite") {
            return "Termite";
        } else if (organismString === "titan_arum") {
            return "Titan arum";
        } else if (organismString === "white_fronted_langur") {
            return "White fronted langur";
        } else {
            return "unknown animal";
        }
    },
    
    indicateProgressStage: function(stage) {
        $('.day1 .indicator').each(function (index) {
            $(this).removeClass('done');
        });
        $('.day1 .indicator').each(function (index) {
            if (stage === (index +1)) {
                $(this).addClass('done');
            } /*else {
                console.log('index ' +index+ ' stage ' +stage);
                return false;
            }*/
        });
    },
    
    //**************FUNCTIONS TO CREATE AND FILL TABLES************************************************

    setupOrganismTable: function() {
        var k = 0;
        var table;
        var tr;
        Sail.app.buttonRevealCounter = 0;
        
        if (EvoRoom.user_metadata.day === "2") {
            table = $('.2mya-table');
        }
        else { 
            table = $('.observe-organism-table');
            table.html('');
        }

        
        _.each(EvoRoom.getCurrentStudentOrganisms(), function(org) {
            k++;
            var img = $('<img />');
            img.data('organism', org);
            img.attr('src', '/images/' + org + '_icon.png');
            img.addClass('organism'+k);
            img.addClass('organism-image');
            var td = $('<td />');
            td.addClass('organism-boxes');
            td.addClass('box'+k);
            
            // check what day it is and build the table based on that
            if (EvoRoom.user_metadata.day === "2") {
                img.click(function() { 
                    Sail.app.hidePageElements();
                    Sail.app.selectedOrganism = $(this).data('organism');
                    
                    // disable the button out after it's clicked, and add to the button reveal counter
                    $(this).addClass('faded');
                    $(this).unbind("click");
                    
                    Sail.app.buttonRevealCounter++;
                    if (Sail.app.buttonRevealCounter >= EvoRoom.getCurrentStudentOrganisms().length) {
                        $('#2mya-choose-organisms .small-button').show();
                    }
                    
                    $('#2mya-organism-details .organism').text(Sail.app.formatOrganismString(Sail.app.selectedOrganism));
                    $('#2mya-organism-details').show();
                });
            }
            else { 
                img.click(function() { 
                    Sail.app.hidePageElements();
                    Sail.app.selectedOrganism = $(this).data('organism');
                    
                    // populate the top right corner image
                    $('#student-chosen-organisms .chosen-organism-image').attr('src', '/images/' + Sail.app.selectedOrganism + '_icon.png');
                    $('#student-chosen-organisms .chosen-organism-image').attr('alt', Sail.app.selectedOrganism);
                    $('#student-chosen-organisms').show();
                    $('.chosen-organism').text(Sail.app.formatOrganismString(Sail.app.selectedOrganism));
                    
                    // disable the button out after it's clicked, and add to the button reveal counter
                    $(this).addClass('faded');
                    $(this).unbind("click");

                    Sail.app.buttonRevealCounter++;
                    if (Sail.app.buttonRevealCounter >= EvoRoom.getCurrentStudentOrganisms().length) {
                        $('#observe-organisms .small-button').show();
                    }
                    
                    $('#is-organism-present').show();
                });
            }

            // add the image and determine whether to add a new row or cell
            td.append(img);
            
            if (k%2 !== 0) {
                tr = $('<tr />');
            }
            
            tr.append(td);
            
            if (k%2 === 0) {
                table.append(tr);
            }
        });
        // close the table
        if (k%2 !== 0) {
            table.append(tr);
        }
    },
    
    setupAncestorTable: function(animal, selector) {
        var k = 0;
        var tr;
        var table;
        var ancestorChosenString = null;
        
        // for the first ancestor table
        if (selector === "partial") {
            $('.ancestor-information-table').html('');
            table = $('.ancestor-information-table');
        }
        // for the second ancestor table
        else if (selector === "full") {
            $('.choose-ancestor-table').html('');
            table = $('.choose-ancestor-table');
        }
        else {
            console.log('error creating ancestor tables - missing selector');
        }
            
        _.each(Sail.app.ancestors[animal], function(org) {
            k++;
            var img = $('<img />');
            img.data('organism', org);
            img.attr('src', '/images/' + org + '_icon.png');
            img.addClass('organism'+k);
            img.addClass('organism-image');
            var td = $('<td />');
            td.addClass('organism-boxes');
            td.addClass('box'+k);
            
            // for the first ancestor table
            if (selector === "partial") {
                img.click(function() { 
                    ancestorChosenString = $(this).data('organism');
                    Sail.app.hidePageElements();
                    
                    $('#ancestor-information-details .chosen-organism').text(Sail.app.formatOrganismString(ancestorChosenString));
                    $('#ancestor-information-details .ancestor-description').text('Where are we going to pull this stuff from?');
                    $('#ancestor-information-details').show();
                });
            }
            // for the second ancestor table
            else if (selector === "full") {
                img.click(function() { 
                    ancestorChosenString = $(this).data('organism');
                    Sail.app.hidePageElements();
                    
                    // send event with guessed ancestor and its antecedant
                    Sail.app.submitOrganismObservation(ancestorChosenString, Sail.app.selectedOrganism);
                    
                    $('#observe-organisms').show();
                });
            }
            else {
                console.log('error binding click in ancestor tables - missing selector');
            }

            // finish the table
            td.append(img);
            
            if (k%2 !== 0) {
                tr = $('<tr />');
            }
            
            tr.append(td);
            
            if (k%2 === 0) {
                table.append(tr);
            }
        });
        if (k%2 !== 0) {
            table.append(tr);
        }
    },
    
    setupPresentDayTable: function () {
        $('#present-day-organisms .present-day-organisms-table tr').each(function (index) {
            var currentOrganisms = EvoRoom.getCurrentStudentOrganisms();
            
            $('.organism-image', this).attr('src', '/images/' + currentOrganisms[index] + '_icon.png');
            // set organism name in tr element
            //$(this).data('organism', currentOrganisms[index]);
            $(this).attr('data-organism', currentOrganisms[index]);
            
            // remove any excess row
            if (index >= currentOrganisms.length) {
                $(this).remove();
            }
        });
    }
    
};
