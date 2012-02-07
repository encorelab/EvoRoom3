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

    ancestors: {"proboscis_monkey":["ant","civet","fig_wasp"]},              // TODO fill this in, useing real data

//    currentLocation: false,
//    organismsRainforestsCompleted: false,
//    firstRainforestAssigned: false,
//    targetRainforest: null,
//    rotationRainforestsCompleted: false,
//    firstInterview: false,
//    secondInterview: false,
//    rationaleAssigned: null,
    
/* ====================================== COLIN =================================== */

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
            
            // set up organism table for next screen
            Sail.app.setUpOrganismTable();

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
            $('#go-to-location .current-location').text(EvoRoom.formatLocationString(EvoRoom.assignedLocation));
            // show screen to scan in location
            $('#go-to-location').show();
        } else if (Sail.app.user_metadata.state === 'OBSERVING_IN_ROTATION') {
            $('#observe-organisms-instructions').show();
        } else if (Sail.app.user_metadata.state === 'ROTATION_COMPLETED') {
            $('#loading-page').show();
        } else if (Sail.app.user_metadata.state === 'WAITING_FOR_MEETUP_TOPIC') {
            $('#team-meeting').show();
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
                console.log('Caught oneoff event stateChangeHandler with to = WAITING_FOR_MEETUP_TOPIC');
                $('#team-meeting').show();
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
    
    //**************FUNCTIONS TO CREATE AND FILL TABLES************************************************

    setUpOrganismTable: function() {
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
    }


};
