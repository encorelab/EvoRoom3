/*jslint devel: true, regexp: true, browser: true, unparam: true, debug: true, sloppy: true, sub: true, es5: true, vars: true, evil: true, fragment: true, plusplus: true, nomen: true, white: true */
/*globals Sail, Rollcall, $, Foo, _, window */

var EvoRoom = {
    user_metadata: null,
    rotation: null,
    currentTeam: null,
    assignedLocation: null,
    currentLocation: null,
    selectedOrganism: null,
    tagsArray: null,

    
/* ====================================== COLIN =================================== */
//    assignedTopic: null,
//    currentRainforest: false,
    
//    currentLocation: false,
//    organismsRainforestsCompleted: false,
//    firstRainforestAssigned: false,
//    targetRainforest: null,
//    rotationRainforestsCompleted: false,
//    firstInterview: false,
//    secondInterview: false,
//    rationaleAssigned: null,

    rollcallURL: '/rollcall',

    events: {
        sail: {
            /********************************************* INCOMING EVENTS *******************************************/
            rotation_start: function(ev) {
                if (ev.payload.rotation) {
                    // show the question assigned to this student
                    if (ev.payload.rotation === 1 || ev.payload.rotation === 2) {
                        EvoRoom.rotation = ev.payload.rotation;
                        console.log("rotation " + EvoRoom.rotation);
                        
                        // can't do show and hide here
                        //Sail.app.hidePageElements();
                        //$('#observe-organisms-instructions').show();
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
                        || ev.payload.location === "station_c" || ev.payload.location === "station_d") {
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
            
            
/* ====================================== COLIN =================================== */
            
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
            }
            
/*            start_step: function(ev) {
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
*/
//old stuff one below
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

/*            rainforests_completed_announcement: function(ev) {
                if (ev.payload.completed_rainforests && ev.payload.username === Sail.app.session.account.login) {
                    // if rainforest is empty we probably missed QR scanning so we just have to go to rainforest scanning first
                    if (Sail.app.currentLocation) {
                        Sail.app.hidePageElements();
                        $('#survey-organisms .location').text(Sail.app.formatRainforestString(Sail.app.currentLocation));
                        $('#survey-organisms').show();
                        // clear radio buttons
                        $('input:radio').prop('checked', false);
                        $('#survey-organisms .radio').button('refresh');

                        // check if the user already did this rainforest
                        if ( _.find(ev.payload.completed_rainforests, function (rainforest) { return rainforest === Sail.app.currentLocation; }) ) {
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
*/
            /*****************************************EVENTS ADDED FOR STEP 2***********************************************/            
/*
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
                        $('#rotation-note-taker .current-rainforest').text(Sail.app.formatRainforestString(Sail.app.currentLocation));
                        $('#rotation-note-taker').show();
                    }
                    else if (ev.payload.task === "guide_looker_upper") {
                        $('#rotation-field-guide .current-rainforest').text(Sail.app.formatRainforestString(Sail.app.currentLocation));
                        $('#rotation-field-guide').show();
                    }
                    else if (ev.payload.task === "prediction_looker_upper") {
                        $('#rotation-prediction .current-rainforest').text(Sail.app.formatRainforestString(Sail.app.currentLocation));
                        $('#rotation-prediction').show();
                    }
                    else if (ev.payload.task === "other") {
                        $('#rotation-field-guide .current-rainforest').text(Sail.app.formatRainforestString(Sail.app.currentLocation));
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
*/
            /*****************************************EVENTS ADDED FOR STEP 3***********************************************/
/*
            interviewees_assigned: function(ev) {
                if (ev.payload.username && ev.payload.username === Sail.app.session.account.login) {
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
*/
            /*****************************************EVENTS ADDED FOR STEP 4***********************************************/            
/*
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
*/
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
        
        $('#meetup-instructions').hide();
        $('#meetup').hide();
        
/* ====================================== COLIN =================================== */
        
        //$('#rainforest-scan-failure').hide();
        //$('#rotation-scan-failure').hide();
        
        // $('#student-chosen-organisms').hide();     // hidePageElements is called repeatedly during step 1, so we can't include this one
/*        $('#survey-welcome').hide();
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
*/
    },

    setupPageLayout: function() {
        // there's still an issue with this (loops one too many times, throws an exception, doesn't break anything)
        // set up display of group members on 'team assignment' page
        var i = 0;
        var groupMember;
        Sail.app.rollcall.request(Sail.app.rollcall.url + "/groups/" + Sail.app.currentTeam + ".json", "GET", {}, function(data) {
            while (true) {
                groupMember = data.group.members[i].user.display_name;
                if (groupMember) {
                    $('#team-assignment .member'+i).text(groupMember);
                } else { 
                    break;
                }
                i++;
            }
        });
        // set up display of team name on 'team assignment' page
        $('#team-assignment .team-name').text(Sail.app.currentTeam);
        
        // set up display of organisms on 'organism assignment' page
        var j = 0;
        var organismArray = Sail.app.getCurrentStudentOrganisms();
        while (j < organismArray.length) {
            j++;
            $('#organism-assignment .assigned-organism-'+j).text(Sail.app.formatOrganismString(organismArray[j-1]));
        }

        $('.jquery-radios').buttonset();
        $('#log-in-success').show();

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
        
        // fill in the student's assigned organisms
        // ABSTRACT AWAY?
        var table = $('.organism-table');
        var k = 0;
        var tr;
        _.each(EvoRoom.getCurrentStudentOrganisms(), function(org) {
            k++;
            var img = $('<img />');
            img.data('organism', org);
            img.attr('src', '/images/' + org + '_icon.png');
            img.addClass('organism'+k);
            img.addClass('organism-image');
            img.click(function() { 
                Sail.app.selectedOrganism = $(this).data('organism');
                
                // populate the top right corner image
                $('#student-chosen-organisms .chosen-organism-image').attr('src', '/images/' + Sail.app.selectedOrganism + '_icon.png');
                $('#student-chosen-organisms').show();
                $('.chosen-organism').text(Sail.app.formatOrganismString(Sail.app.selectedOrganism));
                
                // disable the button out after it's clicked
                $(this).addClass('faded');
                $(this).unbind("click");
                $('#is-organism-present').show();
            });
            
            var td = $('<td />');
            td.addClass('organism-boxes');
            td.addClass('box'+k);
            
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
        
        //*****************************************************************************************
        
        // register on-click listeners for room QR code scanning error resolution
        $('#room-scan-failure .big-button').click(function() {
            // hide everything
            Sail.app.hidePageElements();
            $('#log-in-success').show();
        });

        $('#room-scan-failure .big-error-resolver-button').click(function() {
            // don't need to trigger, just call the function
            Sail.app.barcodeScanRoomLoginSuccess('room');
        });
        
        $('#team-assignment .small-button').click(function() {
            Sail.app.hidePageElements();
            //$('#organism-assignment').show();
            $('#observe-organisms-instructions').show();
            //$('#meetup-instructions').show();
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

            $('#observe-organisms').show();
        });
        
        $('#observe-organisms .organism-table-button').click(function() {
            Sail.app.hidePageElements();
            
            // TODO fix this up
            // populate the image in the top right corner, set as selectedOrganism
/*            var tempString = this.nextSibling.getClass();
            console.log("its coming..................................")
            console.log(tempString);
            Sail.app.selectedOrganism = "ant"//Sail.app.getCurrentStudentOrganisms()[some integer];
*/            $('#student-chosen-organisms .chosen-organism-image').attr('src', '/images/' + Sail.app.selectedOrganism + '_icon.png');
            $('#student-chosen-organisms').show();
            $('.chosen-organism').text(Sail.app.formatOrganismString(Sail.app.selectedOrganism));
            $('#is-organism-present').show();
        });
        
        // on-click listeners for rainforest QR scanning error resolution
        $('#observe-organisms .small-button').click(function() {
            Sail.app.hidePageElements();
            $('#loading-page').show();
        });
        
        $('#is-organism-present .small-button').click(function() {
            Sail.app.hidePageElements();

            if ($('#org-choice-yes').is(':checked')) {
                $('#student-chosen-organisms').hide();
                // TODO grey out the organism that is already done on #observe-organisms
                
                // both params are the same in this case
                Sail.app.submitOrgansimObserved(Sail.app.selectedOrganism, Sail.app.selectedOrganism);
                // clear radio buttons
                $('input:radio').prop('checked', false);
                $('#is-organism-present .radio').button('refresh');
                
                $('#observe-organisms').show();
            }
            else {
                // clear radio buttons
                $('input:radio').prop('checked', false);
                $('#is-organism-present .radio').button('refresh');
                
                // TODO make this dynamic, for each etc
                $('#observe-organisms .organism1').attr('src', '/images/' + Sail.app.user_metadata.assigned_organism_1 + '_icon.png');
                $('#observe-organisms .text1').text(Sail.app.formatOrganismString(Sail.app.user_metadata.assigned_organism_1));
                $('#ancestor-information').show();
            }
        });
        
        $('#ancestor-information .small-button').click(function() {
            Sail.app.hidePageElements();
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
            $('#loading-page').show();
        });
/*
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
            Sail.app.currentLocation = $(this).data('rainforest');
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
*/

        /*************************************STEP 2***********************************************/
/*
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
                Sail.app.currentLocation = result;
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
*/

        /**************************************STEP 3***********************************************/
/*
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
*/

        /**************************************STEP 4***********************************************/
/*
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
            Sail.app.currentLocation = $(this).data('rainforest');
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
*/
    },
    
    restoreState: function() {
        Sail.app.hidePageElements();
        if (!Sail.app.user_metadata.state || Sail.app.user_metadata.state === 'LOGGED_IN') {
            // show login success page
            $('#log-in-success').show();
        } else if (Sail.app.user_metadata.state === 'IN_ROOM') {
            // show the wait for teacher thing
            $('#team-assignment').show();
        } else if (Sail.app.user_metadata.state === 'IN_ROTATION') {
            // show the wait for teacher thing
            $('#loading-page').show();
        } else if (Sail.app.user_metadata.state === 'GOING_TO_ASSIGNED_LOCATION') {
            // retrieve the assigned location to make UI work correctly
            EvoRoom.assignedLocation = Sail.app.user_metadata.currently_assigned_location;
            $('#go-to-location .current-location').text(EvoRoom.formatLocationString(EvoRoom.assignedLocation));
            // show screen to scan in location
            $('#go-to-location').show();
        } else if (Sail.app.user_metadata.state === 'OBSERVING_IN_ROTATION') {
            // retrieve the assigned location to make UI work correctly
            EvoRoom.currentLocation = Sail.app.user_metadata.currently_assigned_location;
            $('#observe-organisms-instructions').show();
        }
        else {
            console.warn('restoreState: read state <'+Sail.app.user_metadata.state+ '> which is not handled currently.');
        }
    },

    /********************************************* OUTGOING EVENTS *******************************************/

    submitCheckIn: function() {
        var sev = new Sail.Event('check_in', {
            team_name:Sail.app.currentTeam,
            location:Sail.app.currentLocation
        });
        
        // one off event handler which is set during the sending of check_in message
        var stateChangeHandler = function (sev) {
            // catching 
            if (sev.payload.to === 'OBSERVING_IN_ROTATION') {
                console.log('Caught oneoff event stateChangeHandler with to = OBSERVING_IN_ROTATION');
                Sail.app.hidePageElements();
                $('#observe-organisms-instructions').show();
            } else if (sev.payload.to === 'WAITING_FOR_MEETUP_TOPIC') {
                // something will happen here ;)
                alert('WAITING_FOR_MEETUP_TOPIC');
            } else {
                console.warn('Caught state_change event with one-off handler, but nobody seems to care. From: ' +sev.payload.from+ 'To: ' + sev.payload.to);
            }
        };
        
        // create state change handler if checkin is not in room
        // eventHandlerFunction, eventType, origin (user), payload,
        if (Sail.app.currentLocation !== 'room') {
            Sail.app.groupchat.addOneoffEventHandler(stateChangeHandler, 'state_change', Sail.app.session.account.login);
        }
        
        Sail.app.groupchat.sendEvent(sev);
    },

    submitOrgansimObserved: function(observedOrganism, assignedOrganism) {
        var sev = new Sail.Event('organism_observation', {
            team_name:Sail.app.currentTeam,
            assigned_organism:assignedOrganism,
            observed_organism:observedOrganism,
            location:EvoRoom.currentLocation,
            time:Sail.app.calculateYear()
        });
        Sail.app.groupchat.sendEvent(sev);
    },
    
    
/* ====================================== COLIN =================================== */
    
    submitNote: function() {
        var sev = new Sail.Event('note', {
            note:$('#meetup .meetup-text-entry').val(),
            tags:Sail.app.tagsArray
        });
        EvoRoom.groupchat.sendEvent(sev);
    },

    
/*
    submitOrganismsPresent: function() {
        var formattedOrg1 = Sail.app.formatOrganismString(Sail.app.user_metadata.assigned_organism_1);
        var formattedOrg2 = Sail.app.formatOrganismString(Sail.app.user_metadata.assigned_organism_2);
        var formattedRadio1 = Sail.app.formatStringToBoolean($('input:radio[name=first-organism-yn]:checked').val());
        var formattedRadio2 = Sail.app.formatStringToBoolean($('input:radio[name=second-organism-yn]:checked').val());
        var sev = new Sail.Event('organism_present', {
            group_code:Sail.app.currentGroupCode,
            author:Sail.app.session.account.login,
            location:Sail.app.currentLocation,
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
            location:Sail.app.currentLocation,
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
*/

    /****************************************** HELPER FUNCTIONS *************************************/

    barcodeScanRoomLoginSuccess: function(result) {
        console.log("Got Barcode: " +result);
        // send out event check_in
        Sail.app.currentLocation = result;
        Sail.app.submitCheckIn();
        // hide everything
        Sail.app.hidePageElements();
        // show waiting for teacher page
        $('#team-assignment').show();
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
    
/* ====================================== COLIN =================================== */
    
/*
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
            Sail.app.currentLocation = result;
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
*/
/*
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
*/
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
    }
};
