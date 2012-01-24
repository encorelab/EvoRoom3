/*jslint devel: true, regexp: true, browser: true, unparam: true, debug: true, sloppy: true, sub: true, es5: true, vars: true, evil: true, fragment: true, plusplus: true, nomen: true, white: true */
/*globals Sail, Rollcall, $, Foo, _, window */

var EvoRoom = {
    user_metadata: null,
    currentGroupCode: null,
    currentRainforest: false,
    organismsRainforestsCompleted: false,
    firstRainforestAssigned: false,
    targetRainforest: null,
    rotationRainforestsCompleted: false,
    firstInterview: false,
    secondInterview: false,
    rationaleAssigned: null,

    rollcallURL: '/rollcall',

    events: {
        sail: {
            /********************************************* INCOMING EVENTS *******************************************/
            start_step: function(ev) {
                if (ev.payload.username && ev.payload.username === Sail.app.session.account.login) {
                    if (ev.payload.step_id) {
                        if (ev.payload.step_id === "STEP_1") {
                            console.log("Received start_step for step1 - nothing done with it right now!");
                        } else if (ev.payload.step_id === "STEP_2") {
                            console.log("Received start_step for step2");
                            Sail.app.hidePageElements();
                            $('#loading-page').show();
                        } else if (ev.payload.step_id === "STEP_3") {
                            console.log("Received start_step for step3");
                            Sail.app.hidePageElements();
                            $('#loading-page').show();
                        } else if (ev.payload.step_id === "STEP_4") {
                            console.log("Received start_step for step4");
                            Sail.app.hidePageElements();
                            $('#group-notes').show();
                        }
                    } else {
                        console.warn("start_step event received, but payload contains no step_id");
                    }
                } else {
                    console.log("start_step event received, but not for this user");
                }
            },

/*            organisms_assignment: function(ev) {
                // check that message is for currently logged in user
                if (ev.payload.username && ev.payload.username === Sail.app.session.account.login) {
                    if (ev.payload.first_organism && ev.payload.second_organism) {
                        Sail.app.hidePageElements();
                        // make sure the survey welcome screen come up with the animals received
                        $('#survey-welcome').show();
                        // assign right organisms according to event
                        $('#student-chosen-organisms .first-organism').attr('src', '/images/' + ev.payload.first_organism + '_icon.png');
                        $('#student-chosen-organisms .second-organism').attr('src', '/images/' + ev.payload.second_organism + '_icon.png');
                        $('#survey-organisms .first-organism-name').text(Sail.app.formatOrganismString(ev.payload.first_organism));
                        $('#survey-organisms .second-organism-name').text(Sail.app.formatOrganismString(ev.payload.second_organism));
                        $('#student-chosen-organisms').show();
                    } else {
                        console.warn("organisms_assignment event received, but payload is either missing first_organism, second_organism, or both");
                    }
                } else {
                    console.log("organisms_assignment event received but NOT for this user");
                }
            },*/

            rainforests_completed_announcement: function(ev) {
                if (ev.payload.completed_rainforests && ev.payload.username === Sail.app.session.account.login) {
                    // if rainforest is empty we probably missed QR scanning so we just have to go to rainforest scanning first
                    if (Sail.app.currentRainforest) {
                        Sail.app.hidePageElements();
                        $('#survey-organisms .location').text(Sail.app.formatRainforestString(Sail.app.currentRainforest));
                        $('#survey-organisms').show();
                        // clear radio buttons
                        $('input:radio').prop('checked', false);
                        $('#survey-organisms .radio').button('refresh');

                        // check if the user already did this rainforest
                        if ( _.find(ev.payload.completed_rainforests, function (rainforest) { return rainforest === Sail.app.currentRainforest; }) ) {
                            // show message and disable radio buttons - user must scan again
                            alert("Rainforest already complete! Please scan another rainforest");
                            $('#survey-organisms .survey-content-box').hide();
                            Sail.app.organismsRainforestCompleted = false;
                            // show the button to scan a rainforest
                            $('#survey-organisms .next-rainforest').show();
                        } else if (ev.payload.completed_rainforests.length >= 3) {
                            // user did all the other forests and is done after this one
                            Sail.app.organismsRainforestCompleted = true;
                            $('#survey-organisms .survey-content-box').show();
                        } else {
                            Sail.app.organismsRainforestCompleted = false;
                            $('#survey-organisms .survey-content-box').show();
                        }
                    } else {
                        Sail.app.hidePageElements();
                        $('#survey-welcome').show();
                    }
                } else {
                    console.warn("rainforests_completed_announcement event received, but payload is either missing go_to_location, username, or both");
                }
            },

            /*****************************************EVENTS ADDED FOR STEP 2***********************************************/            

            location_assignment: function(ev) {
                if (ev.payload.go_to_location && ev.payload.username === Sail.app.session.account.login) {
                    Sail.app.hidePageElements();
                    Sail.app.targetRainforest = ev.payload.go_to_location;

                    if (Sail.app.firstRainforestAssigned) {
                        $('#rotation-next-rainforest .next-rainforest').text(Sail.app.formatRainforestString(Sail.app.targetRainforest));
                        $('#rotation-next-rainforest').show();
                    }
                    else {
                        $('#rotation-intro .current-rainforest').text(Sail.app.formatRainforestString(Sail.app.targetRainforest));
                        $('#rotation-intro').show();
                        Sail.app.firstRainforestAssigned = true;
                    }
                }
                else {
                    console.warn("location_assignment event received, but payload is either missing go_to_location, student, or both");
                }
            },

            task_assignment: function(ev) {
                if (ev.payload.task && ev.payload.username === Sail.app.session.account.login) {
                    Sail.app.hidePageElements();
                    // clear all fields
                    $('#rotation-note-taker .rainforest-explanation-text-entry').val('');
                    $('input:radio').prop('checked', false);
                    $('#rotation-note-taker .radio').button('refresh');

                    if (ev.payload.task === "scribe") {
                        $('#rotation-note-taker .current-rainforest').text(Sail.app.formatRainforestString(Sail.app.currentRainforest));
                        $('#rotation-note-taker').show();
                    }
                    else if (ev.payload.task === "guide_looker_upper") {
                        $('#rotation-field-guide .current-rainforest').text(Sail.app.formatRainforestString(Sail.app.currentRainforest));
                        $('#rotation-field-guide').show();
                    }
                    else if (ev.payload.task === "prediction_looker_upper") {
                        $('#rotation-prediction .current-rainforest').text(Sail.app.formatRainforestString(Sail.app.currentRainforest));
                        $('#rotation-prediction').show();
                    }
                    else if (ev.payload.task === "other") {
                        $('#rotation-field-guide .current-rainforest').text(Sail.app.formatRainforestString(Sail.app.currentRainforest));
                        $('#rotation-field-guide-and-prediction').show();
                    }
                }
                else {
                    console.warn("task_assignment event received, but payload is incomplete");
                }
            },
            
            rainforest_guess_submitted: function(ev) {
                if ((ev.payload.groupCode === Sail.app.currentGroupCode) && (ev.payload.author !== Sail.app.session.account.login)) {
                    Sail.app.hidePageElements();
                    $('#loading-page').show();
                }
            },

            /*****************************************EVENTS ADDED FOR STEP 3***********************************************/

            interviewees_assigned: function(ev) {
                if (ev.payload.username && ev.payload.username === Sail.app.session.account.login) {       // this is a little strange. Is this intentional?
                    if (ev.payload.first_interviewee && ev.payload.second_interviewee) {
                        Sail.app.hidePageElements();
                        // set up first interviewee
                        $('#interview-intro .first-interviewee').text(ev.payload.first_interviewee);
                        // set up second interviewee
                        $('#interview-intro .second-interviewee').text(ev.payload.second_interviewee);

                        $('#interview-intro').show();
                    }
                    else {
                        console.warn("interviewees_assigned event received, but payload is incomplete");
                    }
                }
                else {
                    console.log("interviewees_assigned event received, but not for this user");
                }
            },

            /*****************************************EVENTS ADDED FOR STEP 4***********************************************/            

            rationale_assigned: function(ev) {
                if (ev.payload.question && ev.payload.username === Sail.app.session.account.login) {
                    Sail.app.hidePageElements();

                    // show the question assigned to this student
                    if (ev.payload.question === "strategy") {
                        $('#final-picks-discuss .question1').show();
                    }
                    else if (ev.payload.question === "evidence") {
                        $('#final-picks-discuss .question2').show();
                    }
                    else if (ev.payload.question === "additional_info") {
                        $('#final-picks-discuss .question3').show();
                    }
                    else {
                        alert("agent error. Please reconnect");
                    }
                    Sail.app.rationaleAssigned = ev.payload.question;
                    $('#final-picks-discuss').show();
                }
                else {
                    console.log("rationale_assigned event received, but payload is incomplete or not for this user");
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
                Sail.app.currentGroupCode = data.user.groups[0].name;
                Sail.app.user_metadata = data.user.metadata;
                console.log('metadata assigned');
                Sail.app.setupPageLayout();
                Sail.app.restoreState(); 
            });
        },

        unauthenticated: function(ev) {
            Sail.app.user_metadata = null;
            Sail.app.currentGroupCode = null;
            Sail.app.currentRainforest = false;
            Sail.app.organismsRainforestsCompleted = false;
            Sail.app.firstRainforestAssigned = false;
            Sail.app.targetRainforest = null;
            Sail.app.rotationRainforestsCompleted = false;
            Sail.app.firstInterview = false;
            Sail.app.secondInterview = false;
            Sail.app.rationaleAssigned = null;
            
            Sail.app.hidePageElements();
            
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
        $('#survey-welcome').hide();
        $('#rainforest-scan-failure').hide();
        $('#rotation-scan-failure').hide();
        // $('#student-chosen-organisms').hide();     // hidePageElements is called repeatedly during step 1, so we can't include this one
        $('#survey-organisms').hide();
        $('#survey-organisms .next-rainforest').hide();
        $('#survey-organisms .finished').hide();
        $('#rotation-intro').hide();
        $('#rotation-note-taker').hide();
        $('#rotation-field-guide').hide();
        $('#field-guide-frame').hide();
        $('#rotation-prediction').hide();
        $('#rotation-field-guide-and-prediction').hide();
        $('#group-page-frame').hide();
        $('#iframe-close-button').hide();
        $('#rotation-next-rainforest').hide();
        $('#interview-intro').hide();
        $('#interview').hide();
        $('#group-notes').hide();
        $('#final-picks-ranking').hide();
        $('#final-picks-discuss').hide();
        $('#final-picks-discuss .question1').hide();
        $('#final-picks-discuss .question2').hide();
        $('#final-picks-discuss .question3').hide();
        $('#final-picks-choice').hide();
        $('#final-picks-debrief').hide();
    },

    setupPageLayout: function() {
        $('#student-chosen-organisms .first-organism').attr('src', '/images/' + Sail.app.user_metadata.assigned_organism_1 + '_icon.png');
        $('#student-chosen-organisms .second-organism').attr('src', '/images/' + Sail.app.user_metadata.assigned_organism_2 + '_icon.png');
        $('#survey-organisms .first-organism-name').text(Sail.app.formatOrganismString(Sail.app.user_metadata.assigned_organism_1));
        $('#survey-organisms .second-organism-name').text(Sail.app.formatOrganismString(Sail.app.user_metadata.assigned_organism_2));
        $('.jquery-radios').buttonset();
        //$('#log-in-success').show();

        $('#log-in-success .big-button').click(function() {
            // check if barcodeScanner is possible (won't be outside of PhoneGap app)
            if (window.plugins.barcodeScanner) {
                // trigger the QR scan screen/module to scan room entry
                window.plugins.barcodeScanner.scan(Sail.app.barcodeScanRoomLoginSuccess, Sail.app.barcodeScanRoomLoginFailure);
            } else {
                // trigger the error handler to get alternative
                Sail.app.barcodeScanRoomLoginFailure('No scanner, probably desktop browser');
            }
        });

        // register on-click listeners for room QR code scanning error resolution
        $('#room-scan-failure .big-button').click(function() {
            // hide everything
            Sail.app.hidePageElements();
            // show start page and organisms
            $('#student-chosen-organisms').show();
            $('#log-in-success').show();
        });

        $('#room-scan-failure .big-error-resolver-button').click(function() {
            // here I would like to trigger Sail.app.barcodeScanRoomLoginSuccess since it does everything, but don't know how to hand in attributes
            //$(Sail.app).trigger('barcodeScanRoomLoginSuccess', 'room');
            
            // don't need to trigger, just call the function
            Sail.app.barcodeScanRoomLoginSuccess('room');

            // send out event check_in
            /*Sail.app.currentRainforest = "room";
            Sail.app.submitCheckIn();
            // hide everything
            Sail.app.hidePageElements();
            // show waiting page
            $('#survey-welcome').show();
            $('#student-chosen-organisms').show();*/
        });

        $('#survey-welcome .big-button').click(function() {
            
            // trigger the QR scan screen/module to scan rainforests
            if (window.plugins.barcodeScanner) {
                window.plugins.barcodeScanner.scan(Sail.app.barcodeScanRainforestSuccess, Sail.app.barcodeScanRainforestFailure);
            } else {
                // trigger the error handler to get alternative
                Sail.app.barcodeScanRainforestFailure('No scanner, probably desktop browser');
            }
        });

        // on-click listeners for rainforest QR scanning error resolution
        $('#rainforest-scan-failure .big-button').click(function() {
            // hide everything
            Sail.app.hidePageElements();
            // show start page
            $('#survey-welcome').show();
        });

        $('#rainforest-scan-failure .small-error-resolver-button').click(function() {
            // send out event check_in
            Sail.app.currentRainforest = $(this).data('rainforest');
            Sail.app.submitCheckIn();
            // hide everything
            Sail.app.hidePageElements();
            // wait
            $('#student-chosen-organisms').show();
            $('#loading-page').show();
        });


        // setting up 3 on-click events for survey-organism
        $('#survey-organisms .radio').click(function() {
            if ( $('.first-radios').is(':checked') && $('.second-radios').is(':checked') ) {
                // decission about completion is made in event handler for rainforests_completed
                if (Sail.app.organismsRainforestCompleted) {
                    $('#survey-organisms .finished').show();
                }
                else {
                    $('#survey-organisms .next-rainforest').show();
                }
            }
        });

        // on-click event to scan another rainforest
        $('#survey-organisms .big-button').click(function() {
            Sail.app.hidePageElements();

            // Caution: we only send the event here to allow the user to change yes/no
            // only send the organisms_present event if both radio buttons are checked
            if ( $('.first-radios').is(':checked') && $('.second-radios').is(':checked') ) {
                Sail.app.submitOrganismsPresent();
            }

            // clear radio buttons
            $('input:radio').prop('checked', false);
            $('#survey-organisms .radio').button('refresh');

            // trigger the QR scan screen/module to scan rainforests
            if (window.plugins.barcodeScanner) {
                window.plugins.barcodeScanner.scan(Sail.app.barcodeScanRainforestSuccess, Sail.app.barcodeScanRainforestFailure);
            } else {
                // trigger the error handler to get alternative
                Sail.app.barcodeScanRainforestFailure('No scanner, probably desktop browser');
            }
        });

        // on-click event to finish step1
        $('#survey-organisms .small-button').click(function() {
            Sail.app.hidePageElements();
            $('#student-chosen-organisms').hide();
            
            // we also need to submit the organisms_present event
            if ( $('.first-radios').is(':checked') && $('.second-radios').is(':checked') ) {
                Sail.app.submitOrganismsPresent();
            }

            // show wait screen and wait for start_step event to show rotation-intro
            $('#loading-page').show();
        });


        /*************************************STEP 2***********************************************/

        $('#rotation-intro .big-button').click(function() {
            // trigger the QR scan screen/module to scan rainforests
            if (window.plugins.barcodeScanner) {
                window.plugins.barcodeScanner.scan(Sail.app.barcodeScanCheckLocationAssignmentSuccess, Sail.app.barcodeScanCheckLocationAssignmentFailure);
            } else {
                // call the error handler to get alternative
                Sail.app.barcodeScanCheckLocationAssignmentFailure('No scanner, probably desktop browser');
            }
        });
        
        // rotation QR scanner error handler
        $('#rotation-scan-failure .big-button').click(function() {
            // hide everything
            Sail.app.hidePageElements();
            // show start page
            $('#rotation-next-rainforest').show();
        });
        
        $('#rotation-scan-failure .small-error-resolver-button').click(function() {
            var result = $(this).data('rainforest');
            
            console.log("Got 'fake' Barcode: " +result);
            // hide everything
            Sail.app.hidePageElements();
            // check if they are at the correct place
            if (Sail.app.targetRainforest === result) {
                Sail.app.currentRainforest = result;
                Sail.app.submitCheckIn();
                $('#loading-page').show();
            }
            // alert and send them back to the 5th screen
            else {
                alert ("You are at the wrong location, please scan again at the correct location");
                $('#rotation-next-rainforest').show();
            }
        });

        // notetaker submits whether they think this is their rainforest
        $('#rotation-note-taker .small-button').click(function() {
            Sail.app.submitRainforestGuess();
            Sail.app.hidePageElements();
            $('#loading-page').show();
        });

        // wiring in the stuff for iframes
        $('#rotation-field-guide .field-guide-link').click(function() {
            $('#field-guide-frame').show();
            $('#field-guide-frame').appendTo('#rotation-field-guide');
            $('#iframe-close-button').show();
            $('#iframe-close-button').appendTo('#rotation-field-guide');
        });

        // wiring in the stuff for iframes
        $('#rotation-prediction .group-page-link').click(function() {
            $('#group-page-frame').show();
            $('#group-page-frame').appendTo('#rotation-prediction');
            $('#iframe-close-button').show();
            $('#iframe-close-button').appendTo('#rotation-prediction');
        });

        // wiring in the stuff for iframes
        $('#rotation-field-guide-and-prediction .field-guide-link').click(function() {
            $('#field-guide-frame').show();
            $('#field-guide-frame').appendTo('#rotation-field-guide-and-prediction');
            $('#iframe-close-button').show();
            $('#iframe-close-button').appendTo('#rotation-field-guide-and-prediction');
        });

        // wiring in the stuff for iframes
        $('#rotation-field-guide-and-prediction .group-page-link').click(function() {
            $('#group-page-frame').show();
            $('#group-page-frame').appendTo('#rotation-field-guide-and-prediction');
            $('#iframe-close-button').show();
            $('#iframe-close-button').appendTo('#rotation-field-guide-and-prediction');
        }); 

        // wiring in the stuff for iframes
        $('#iframe-close-button').click(function() {
            $('.iframe').hide();
            $('#iframe-close-button').hide();
        });

        $('#rotation-next-rainforest .big-button').click(function() {
            Sail.app.hidePageElements();
            
            // trigger the QR scan screen/module to scan rainforests
            if (window.plugins.barcodeScanner) {
                window.plugins.barcodeScanner.scan(Sail.app.barcodeScanCheckLocationAssignmentSuccess, Sail.app.barcodeScanCheckLocationAssignmentFailure);
            } else {
                // call the error handler to get alternative
                Sail.app.barcodeScanCheckLocationAssignmentFailure('No scanner, probably desktop browser');
            }
            
            //window.plugins.barcodeScanner.scan(Sail.app.barcodeScanCheckLocationAssignmentSuccess, Sail.app.barcodeScanFailure);
        });


        /**************************************STEP 3***********************************************/

        $('#interview-intro .first-interviewee').click(function() {
            $('#interview .interview-choice').text($('#interview-intro .first-interviewee').text());
            $('#interview-intro').hide();
            $('#interview').show();

            Sail.app.firstInterview = true;
            Sail.app.startInterview();
        });

        $('#interview-intro .second-interviewee').click(function() {
            $('#interview .interview-choice').text($('#interview-intro .second-interviewee').text());
            $('#interview-intro').hide();
            $('#interview').show();

            Sail.app.secondInterview = true;
            Sail.app.startInterview();
        });

        // this might be a: sloppy, b: dangerous (will they *always* have exactly 2 interviews?). Is there a better approach?
        $('#interview .small-button').click(function() {
            if (Sail.app.firstInterview && Sail.app.secondInterview) {
                Sail.app.submitInterview();

                $('#interview').hide();
                $('#group-notes').show();
            }
            else {
                Sail.app.submitInterview();

                $('#interview .variable-dropdown').val('');
                $('#interview .interview-content-text-entry').val('');

                $('#interview').hide();
                $('#interview-intro').show();
            }
        });


        /**************************************STEP 4***********************************************/

        $('#group-notes .sync-button').click(function() {
            Sail.app.getInterviews();
        });

        $('#group-notes .small-button').click(function() {
            $('#group-notes').hide();
            $('#final-picks-ranking').show();
        });

        $('#final-picks-ranking .small-button').click(function() {
            Sail.app.hidePageElements();
            $('#loading-page').show();
            Sail.app.submitRankings();
        });

        $('#final-picks-discuss .small-button').click(function() {
            Sail.app.submitRationale();
            Sail.app.hidePageElements();
            $('#final-picks-choice').show();
        });
        
        // on-click listeners for rainforest QR scanning error resolution
        $('#final-picks-scan-failure .big-button').click(function() {
            // hide everything
            Sail.app.hidePageElements();
            // show start page
            $('#final-picks-choice').show();
        });

        $('#final-picks-scan-failure .small-error-resolver-button').click(function() {
            // send out event check_in
            Sail.app.currentRainforest = $(this).data('rainforest');
            Sail.app.submitCheckIn();
            // hide everything
            Sail.app.hidePageElements();
            $('#final-picks-debrief').show();
        });

        $('#final-picks-choice .big-button').click(function() {
            // trigger the QR scan screen/module to scan rainforests
            if (window.plugins.barcodeScanner) {
                window.plugins.barcodeScanner.scan(Sail.app.barcodeScanFinalPicksSuccess, Sail.app.barcodeScanFinalPicksFailure);
            } else {
                // call the error handler to get alternative
                Sail.app.barcodeScanFinalPicksFailure('No scanner, probably desktop browser');
            }
            //window.plugins.barcodeScanner.scan(Sail.app.barcodeScanSuccessRainforest, Sail.app.barcodeScanFailure);
            Sail.app.hidePageElements();
            $('#final-picks-debrief').show();
        });

    },
    
    restoreState: function() {
        //alert('bring user back to state');
        if (!Sail.app.user_metadata.state || Sail.app.user_metadata.state === 'LOGGED_IN') {
            // show page to do room QR scanning
            $('#log-in-success').show();
        } else if (Sail.app.user_metadata.state === 'IN_ROOM' || Sail.app.user_metadata.state === 'AT_PRESENCE_LOCATION') {
            // show page to do rainforst QR scanning
            $('#survey-welcome').show();
        } else if (Sail.app.user_metadata.state === 'GUESS_LOCATION_ASSIGNED') {
            Sail.app.targetRainforest = Sail.app.user_metadata.currently_assigned_location;
            $('#rotation-next-rainforest .next-rainforest').text(Sail.app.formatRainforestString(Sail.app.user_metadata.currently_assigned_location));
            $('#rotation-next-rainforest').show();
        } else if (Sail.app.user_metadata.state === 'AT_ASSIGNED_GUESS_LOCATION') {
            // wait for task_assignment message (from agent once all team members are at this state)
            Sail.app.targetRainforest = Sail.app.user_metadata.currently_assigned_location;
            $('#loading-page').show();
        } else if (Sail.app.user_metadata.state === 'GUESS_TASK_ASSIGNED') {
            Sail.app.currentRainforest = Sail.app.user_metadata.currently_assigned_location;
            if (Sail.app.user_metadata.currently_assigned_task === 'scribe') {
                $('#rotation-note-taker').show();
            } else {
                $('#rotation-field-guide-and-prediction').show();
            }
        } else if (Sail.app.user_metadata.state === 'INTERVIEWEES_ASSIGNED' || Sail.app.user_metadata.state === 'INTERVIEWING') {
            $('#interview-intro .first-interviewee').text(Sail.app.user_metadata.interviewee_1);
            $('#interview-intro .second-interviewee').text(Sail.app.user_metadata.interviewee_2);
            $('#interview-intro').show();
        } else if (Sail.app.user_metadata.state === 'WAITING_FOR_RANKINGS') {
            $('#final-picks-ranking').show();
        } else if (Sail.app.user_metadata.state === 'WAITING_FOR_RATIONALE_SUBMISSION') {
            Sail.app.rationaleAssigned = Sail.app.user_metadata.assigned_rationale;
            if (Sail.app.user_metadata.assigned_rationale === 'strategy') {
                $('#discussion-content-box .question1').show();
            } else if (Sail.app.user_metadata.assigned_rationale === 'evidence') {
                $('#discussion-content-box .question2').show();
            } else if (Sail.app.user_metadata.assigned_rationale === 'additional_info') {
                $('#discussion-content-box .question3').show();
            }
            $('#final-picks-discuss').show();
        } else if (Sail.app.user_metadata.state === 'WAITING_FOR_FINAL_GUESS') {
            $('#final-picks-choice').show();
        }
        else {
            console.warn('restoreState: read state <'+Sail.app.user_metadata.state+ '> which is not handled currently.');
        }
    },

    /********************************************* OUTGOING EVENTS *******************************************/

    submitCheckIn: function() {
        var sev = new Sail.Event('check_in', {
            group_code:Sail.app.currentGroupCode,
            location:Sail.app.currentRainforest
        });
        EvoRoom.groupchat.sendEvent(sev);
    },

    submitOrganismsPresent: function() {
        var formattedOrg1 = Sail.app.formatOrganismString(Sail.app.user_metadata.assigned_organism_1);
        var formattedOrg2 = Sail.app.formatOrganismString(Sail.app.user_metadata.assigned_organism_2);
        var formattedRadio1 = Sail.app.formatStringToBoolean($('input:radio[name=first-organism-yn]:checked').val());
        var formattedRadio2 = Sail.app.formatStringToBoolean($('input:radio[name=second-organism-yn]:checked').val());
        var sev = new Sail.Event('organism_present', {
            group_code:Sail.app.currentGroupCode,
            author:Sail.app.session.account.login,
            location:Sail.app.currentRainforest,
            first_organism:{
                organism:formattedOrg1,
                present:formattedRadio1
            },
            second_organism:{
                organism:formattedOrg2,
                present:formattedRadio2
            }
        });
        EvoRoom.groupchat.sendEvent(sev);
    },

    submitRainforestGuess: function() {
        var formattedYesNo = Sail.app.formatStringToBoolean($('input:radio[name=your-rainforest]:checked').val());
        var sev = new Sail.Event('rainforest_guess_submitted', {
            group_code:Sail.app.currentGroupCode,
            author:Sail.app.session.account.login,
            location:Sail.app.currentRainforest,
            your_rainforest:formattedYesNo,
            explanation:$('#rotation-note-taker .rainforest-explanation-text-entry').val()
        });
        EvoRoom.groupchat.sendEvent(sev);
    },

    startInterview: function() {
        var sev = new Sail.Event('interview_started', {
            group_code:Sail.app.currentGroupCode,
            author:Sail.app.session.account.login,
            interviewee:$('#interview .interview-choice').text()
        });
        EvoRoom.groupchat.sendEvent(sev);
    },      

    submitInterview: function() {
        var sev = new Sail.Event('interview_submitted', {
            group_code:Sail.app.currentGroupCode,
            author:Sail.app.session.account.login,
            interviewee:$('#interview .interview-choice').text(),
            variable:$('select.variable-dropdown').val(),
            notes:$('#interview .interview-content-text-entry').val()
        });
        EvoRoom.groupchat.sendEvent(sev);
    },

    submitRankings: function() {
        var sev = new Sail.Event('rankings_submitted', {
            group_code:Sail.app.currentGroupCode,
            author:Sail.app.session.account.login,
            ranks:{
                rainforest_a:$('select.A-dropdown').val(),
                rainforest_b:$('select.B-dropdown').val(),
                rainforest_c:$('select.C-dropdown').val(),
                rainforest_d:$('select.D-dropdown').val()
            }
        });
        EvoRoom.groupchat.sendEvent(sev);
    },

    submitRationale: function() {
        var textToSubmit = "";
        if (Sail.app.rationaleAssigned === "strategy") {
            textToSubmit = $('#final-picks-discuss .question1 .discussion-content-text-entry').val();
        } else if (Sail.app.rationaleAssigned === "evidence") {
            textToSubmit = $('#final-picks-discuss .question2 .discussion-content-text-entry').val();
        } else if (Sail.app.rationaleAssigned === "additional_info") {
            textToSubmit = $('#final-picks-discuss .question3 .discussion-content-text-entry').val();
        } else {
            console.log("Rationale does not match question");
        }
        var sev = new Sail.Event('rationale_submitted', {
            group_code:Sail.app.currentGroupCode,
            author:Sail.app.session.account.login,
            question:Sail.app.rationaleAssigned,
            answer:textToSubmit
        });
        EvoRoom.groupchat.sendEvent(sev);
    },  


    /****************************************** HELPER FUNCTIONS *************************************/

    barcodeScanRoomLoginSuccess: function(result) {
        console.log("Got Barcode: " +result);
        // send out event check_in
        Sail.app.currentRainforest = result;
        Sail.app.submitCheckIn();
        // hide everything
        Sail.app.hidePageElements();
        // show waiting page
        $('#survey-welcome').show();
        $('#student-chosen-organisms').show();
    },

    barcodeScanRoomLoginFailure: function(msg) {
        console.warn("SCAN FAILED: "+msg);
        // hide everything
        Sail.app.hidePageElements();
        $('#room-scan-failure').show();
    },

    barcodeScanRainforestSuccess: function(result) {
        console.log("Got Barcode: " +result);
        // send out event check_in
        Sail.app.currentRainforest = result;
        Sail.app.submitCheckIn();
        // hide everything
        Sail.app.hidePageElements();
        // show waiting page
        $('#loading-page').show();
    },

    barcodeScanRainforestFailure: function(msg) {
        console.warn("SCAN FAILED: "+msg);
        // hide everything
        Sail.app.hidePageElements();
        $('#rainforest-scan-failure').show();
    },
    
    barcodeScanFinalPicksSuccess: function(result) {
        console.log("Got Barcode: " +result);
        // send out event check_in
        Sail.app.currentRainforest = result;
        Sail.app.submitCheckIn();
        // hide everything
        Sail.app.hidePageElements();
        // show waiting page
        $('#final-picks-debrief').show();
    },

    barcodeScanFinalPicksFailure: function(msg) {
        console.warn("SCAN FAILED: "+msg);
        // hide everything
        Sail.app.hidePageElements();
        $('#final-picks-scan-failure').show();
    },

    barcodeScanCheckLocationAssignmentSuccess: function(result) {
        console.log("Got Barcode: " +result);
        // hide everything
        Sail.app.hidePageElements();
        // check if they are at the correct place
        if (Sail.app.targetRainforest === result) {
            Sail.app.currentRainforest = result;
            Sail.app.submitCheckIn();
            $('#loading-page').show();
        }
        // alert and send them back to the 5th screen
        else {
            alert ("You are at the wrong location, please scan again at the correct location");
            $('#rotation-next-rainforest').show();
        }

    },
    
    barcodeScanCheckLocationAssignmentFailure: function(msg) {
        console.log("Got Barcode: " +msg);
        // hide everything
        Sail.app.hidePageElements();
        $('#rotation-scan-failure').show();
    },

    barcodeScanFailure: function(msg) {
        alert("SCAN FAILED: "+msg);
    },

    getInterviews: function() {
        $.ajax({
            type: "GET",
            url: "/mongoose/evoroom/events/_find",
            data: {criteria: JSON.stringify({"run.name":Sail.app.run.name, "eventType":"interview_submitted", "payload.group_code":Sail.app.currentGroupCode})},
            context: {},        // should this be changed?
            success: function(data) {
                //criteria = {"run.name":Sail.app.run.name, "eventType":"interview_submitted", "payload.group_code":Sail.app.currentGroupCode};

                if (data.ok === 1) {
                    var x = 1;
                    for (x = 1; x < 7; x++) {
                        $('#group-notes .researcher.'+x).text(data.results[x-1].payload.interviewee);
                        if (data.results[x-1].payload.variable) {
                            $('#group-notes .variable.'+x).text(data.results[x-1].payload.variable);
                        }
                        else {
                            $('#group-notes .variable.'+x).text('');
                        }
                        if (data.results[x-1].payload.notes) {
                            $('#group-notes .notes.'+x).text(data.results[x-1].payload.notes);
                        }
                        else {
                            //data.results[x-1].payload.notes.text('');
                            $('#group-notes .notes.'+x).text('');
                        }
                    }
                }
            }
        });
    },

    formatRainforestString: function(rainforestString) {
        if (rainforestString === "rainforest_a") {
            return "Rainforest A";
        } else if (rainforestString === "rainforest_b") {
            return "Rainforest B";
        } else if (rainforestString === "rainforest_c") {
            return "Rainforest C";
        } else if (rainforestString === "rainforest_d") {
            return "Rainforest D";
        } else if (rainforestString === "room") {
            console.warn('Rainforest ' + rainforestString + ' is wrong at this point. Inform user with alert!');
            alert("An error has occured. Please talk to a teacher");
        } else {
            console.warn('Rainforest ' + rainforestString + ' is wrong at this point and we return <unknown rainforest>');
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
        } else if (organismString === "white_fronted_langur") {
            return "White fronted langur";
        } else {
            return "unknown animal";
        }
    }
};
