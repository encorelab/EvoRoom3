/*jslint devel: true, regexp: true, browser: true, unparam: true, debug: true, sloppy: true, sub: true, es5: true, vars: true, evil: true, fragment: true, plusplus: true, nomen: true, white: true, eqeq: false */
/*globals Sail, Rollcall, $, Foo, _, window */

var EvoRoom = {
    user_metadata: null,
    rotation: null,
    currentTeam: null,
    assignedLocation: null,
    currentLocation: null,
    currentTime: null,
    selectedOrganism: null,
    buttonRevealCounter: 0,

    ancestorsText: {
        "anisopodidae":"Anisopodidae is a small cosmopolitan family of gnat-like flies known as wood gnats or window-gnats with 154 described extant species in 15 genera, and several described fossil taxa. Some species are saprophagous or fungivorous. They are mostly small to medium-sized flies, except the genera Olbiogaster and Lobogaster, which are large with bizarrely spatulate abdomens. Their phylogenetic placement is controversial. They have been proposed to be the sister group to the higher flies, the Brachycera.",
        "araucariaceae":"Araucariaceae is a family of evergreen trees that are usually 60 or more meters. The Araucariaceae are monoecious or dioecious trees comprising two genera and about 30 species of the Southern Hemisphere. The leaves are opposite or spirally arranged and are needlelike to broad. The male or microsporangiate strobili are axillary or terminal, comprising many spirally arranged microsporophylls, each bearing 5-20 linear, pendant microsporangia on the lower surface. The pollen grains lack wings. The female or megasporangiate strobili are generally large and somewhat woody, with numerous spirally disposed ovuliferous scales, each fused with its bract and bearing a single median ovule on the upper surface.",

    },

    ancestors: {
        "200_mya": {
            //plants
            "fig_tree":["lycophyte","cycad","ginkgophyta","none"],
            "forest_durian":["lycophyte","cycad","ginkgophyta","none"],
            "ginger":["lycophyte","cycad","ginkgophyta","none"],
            "jambu_tree":["lycophyte","cycad","ginkgophyta","none"],
            "meggaris_tree":["lycophyte","cycad","ginkgophyta","none"],
            "pitcher _plant":["lycophyte","cycad","ginkgophyta","none"],
            "rafflesia":["lycophyte","cycad","ginkgophyta","none"],
            "tetrastigma":["lycophyte","cycad","ginkgophyta","none"],
            "titan_arum":["lycophyte","cycad","ginkgophyta","none"],
            //insects
            "ant":["cupedidae","anisopodidae","cicadellidae","none"],
            "fig_wasp":["cupedidae","anisopodidae","cicadellidae","none"],
            "termite":["cupedidae","anisopodidae","cicadellidae","none"],
            //primates
            "bornean_orangutan":["hadrocodium","theropod","thecodont","none"],
            "mitered_leaf_monkey":["hadrocodium","theropod","thecodont","none"],
            "muellers_gibbon":["hadrocodium","theropod","thecodont","none"],
            "proboscis_monkey":["hadrocodium","theropod","thecodont","none"],
            "sumatran_orangutan":["hadrocodium","theropod","thecodont","none"],
            "white_fronted_langur":["hadrocodium","theropod","thecodont","none"],
            //birds
            "blue_headed_pitta":["hadrocodium","theropod","thecodont","none"],
            "garnet_pitta":["hadrocodium","theropod","thecodont","none"],
            "helmeted _hornbill":["hadrocodium","theropod","thecodont","none"],
            "malabar_grey_hornbill":["hadrocodium","theropod","thecodont","none"],
            "great_argus_pheasant":["hadrocodium","theropod","thecodont","none"],
            "rhinoceros_hornbill":["hadrocodium","theropod","thecodont","none"],
            //other mammals 1
            "civet":["hadrocodium","theropod","thecodont","none"],
            "sunda_clouded_leopard":["hadrocodium","theropod","thecodont","none"],
            "leopard_cat":["hadrocodium","theropod","thecodont","none"],
            "sumatran_tiger":["hadrocodium","theropod","thecodont","none","none"],
            //other mammals 2
            "borneo_porcupine":["hadrocodium","theropod","thecodont","none"],
            "common_porcupine":["hadrocodium","theropod","thecodont","none"],
            "sunda_pangolin":["hadrocodium","theropod","thecodont","none"],
            "sumatran_striped_rabbit":["hadrocodium","theropod","thecodont","none"],
            //other mammals 3
            "malayan_tapir":["hadrocodium","theropod","thecodont","none"],
            "sumatran_rhinoceros":["hadrocodium","theropod","thecodont","none"]
        },
        "150_mya": {
            //plants
            "fig_tree":["araucariaceae","cycad","pinaceae","none"],
            "forest_durian":["araucariaceae","cycad","pinaceae","none"],
            "ginger":["araucariaceae","cycad","pinaceae","none"],
            "jambu_tree":["araucariaceae","cycad","pinaceae","none"],
            "meggaris_tree":["araucariaceae","cycad","pinaceae","none"],
            "pitcher _plant":["araucariaceae","cycad","pinaceae","none"],
            "rafflesia":["araucariaceae","cycad","pinaceae","none"],
            "tetrastigma":["araucariaceae","cycad","pinaceae","none"],
            "titan_arum":["araucariaceae","cycad","pinaceae","none"],
            //insects
            "ant":["chrysomeloidea","mesokristensenia","styporaphidia","none"],
            "fig_wasp":["chrysomeloidea","mesokristensenia","styporaphidia","none"],
            "termite":["chrysomeloidea","mesokristensenia","styporaphidia","none"],
            //primates
            "bornean_orangutan":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "mitered_leaf_monkey":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "muellers_gibbon":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "proboscis_monkey":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "sumatran_orangutan":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "white_fronted_langur":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            //birds
            "blue_headed_pitta":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "garnet_pitta":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "helmeted _hornbill":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "malabar_grey_hornbill":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "great_argus_pheasant":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "rhinoceros_hornbill":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            //other mammals 1
            "civet":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "sunda_clouded_leopard":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "leopard_cat":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "sumatran_tiger":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            //other mammals 2
            "borneo_porcupine":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "common_porcupine":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "sunda_pangolin":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "sumatran_striped_rabbit":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            //other mammals 3
            "malayan_tapir":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
            "sumatran_rhinoceros":["archaeopteryx","crusafonta","yangchuanosaurus","none"]
        },
        "100_mya": {
            //plants
            "fig_tree":["williamsonia","ribbonwood_tree","cycadeoidea_marylandica","none"],
            "forest_durian":["williamsonia","ribbonwood_tree","cycadeoidea_marylandica","none"],
            "ginger":["williamsonia","ribbonwood_tree","cycadeoidea_marylandica","none"],
            "jambu_tree":["williamsonia","ribbonwood_tree","cycadeoidea_marylandica","none"],
            "meggaris_tree":["williamsonia","ribbonwood_tree","cycadeoidea_marylandica","none"],
            "pitcher _plant":["williamsonia","ribbonwood_tree","cycadeoidea_marylandica","none"],
            "rafflesia":["williamsonia","ribbonwood_tree","cycadeoidea_marylandica","none"],
            "tetrastigma":["williamsonia","ribbonwood_tree","cycadeoidea_marylandica","none"],
            "titan_arum":["williamsonia","ribbonwood_tree","cycadeoidea_marylandica","none"],
            //insects
            "ant":["mastotermitidae","early_sphecoid_wasp","empididae","none"],
            "fig_wasp":["mastotermitidae","early_sphecoid_wasp","empididae","none"],
            "termite":["mastotermitidae","early_sphecoid_wasp","empididae","none"],
            //primates
            "bornean_orangutan":["multituberculata","eomaia","pterosaur","none"],
            "mitered_leaf_monkey":["multituberculata","eomaia","pterosaur","none"],
            "muellers_gibbon":["multituberculata","eomaia","pterosaur","none"],
            "proboscis_monkey":["multituberculata","eomaia","pterosaur","none"],
            "sumatran_orangutan":["multituberculata","eomaia","pterosaur","none"],
            "white_fronted_langur":["multituberculata","eomaia","pterosaur","none"],
            //birds
            "blue_headed_pitta":["enantiornithes","yanornis","pterosaur","none"],
            "garnet_pitta":["enantiornithes","yanornis","pterosaur","none"],
            "helmeted _hornbill":["enantiornithes","yanornis","pterosaur","none"],
            "malabar_grey_hornbill":["enantiornithes","yanornis","pterosaur","none"],
            "great_argus_pheasant":["enantiornithes","yanornis","pterosaur","none"],
            "rhinoceros_hornbill":["enantiornithes","yanornis","pterosaur","none"],
            //other mammals 1
            "civet":["multituberculata","eomaia","pterosaur","none"],
            "sunda_clouded_leopard":["multituberculata","eomaia","pterosaur","none"],
            "leopard_cat":["multituberculata","eomaia","pterosaur","none"],
            "sumatran_tiger":["multituberculata","eomaia","pterosaur","none"],
            //other mammals 2
            "borneo_porcupine":["multituberculata","eomaia","pterosaur","none"],
            "common_porcupine":["multituberculata","eomaia","pterosaur","none"],
            "sunda_pangolin":["multituberculata","eomaia","pterosaur","none"],
            "sumatran_striped_rabbit":["multituberculata","eomaia","pterosaur","none"],
            //other mammals 3
            "malayan_tapir":["multituberculata","eomaia","pterosaur","none"],
            "sumatran_rhinoceros":["multituberculata","eomaia","pterosaur","none"]
        },
        "50_mya": {
            //plants
            "fig_tree":["lycophyte","pinaceae","cycadeoidea_marylandica","none"],
            "forest_durian":["lycophyte","pinaceae","cycadeoidea_marylandica","none"],
            "ginger":["lycophyte","pinaceae","cycadeoidea_marylandica","none"],
            "jambu_tree":["lycophyte","pinaceae","cycadeoidea_marylandica","none"],
            "meggaris_tree":["lycophyte","pinaceae","cycadeoidea_marylandica","none"],
            "pitcher _plant":["lycophyte","pinaceae","cycadeoidea_marylandica","none"],
            "rafflesia":["lycophyte","pinaceae","cycadeoidea_marylandica","none"],
            "tetrastigma":["lycophyte","pinaceae","cycadeoidea_marylandica","none"],
            "titan_arum":["lycophyte","pinaceae","cycadeoidea_marylandica","none"],
            //insects
            "ant":["chrysomeloidea","mesokristensenia","empididae","none"],
            "fig_wasp":["chrysomeloidea","mesokristensenia","empididae","none"],
            "termite":["chrysomeloidea","mesokristensenia","empididae","none"],
            //primates
            "bornean_orangutan":["purgatorius","multituberculata","miacid","none"],
            "mitered_leaf_monkey":["purgatorius","multituberculata","miacid","none"],
            "muellers_gibbon":["purgatorius","multituberculata","miacid","none"],
            "proboscis_monkey":["purgatorius","multituberculata","miacid","none"],
            "sumatran_orangutan":["purgatorius","multituberculata","miacid","none"],
            "white_fronted_langur":["purgatorius","multituberculata","miacid","none"],
            //birds
            "blue_headed_pitta":["passeriform","bucerotidae","phasianidae","none"],
            "garnet_pitta":["passeriform","bucerotidae","phasianidae","none"],
            "helmeted _hornbill":["passeriform","bucerotidae","phasianidae","none"],
            "malabar_grey_hornbill":["passeriform","bucerotidae","phasianidae","none"],
            "great_argus_pheasant":["passeriform","bucerotidae","phasianidae","none"],
            "rhinoceros_hornbill":["passeriform","bucerotidae","phasianidae","none"],
            //other mammals 1
            "civet":["multituberculata","gomphos_elkema","miacid","none"],
            "sunda_clouded_leopard":["multituberculata","gomphos_elkema","miacid","none"],
            "leopard_cat":["multituberculata","gomphos_elkema","miacid","none"],
            "sumatran_tiger":["multituberculata","gomphos_elkema","miacid","none"],
            //other mammals 2
            "borneo_porcupine":["multituberculata","gomphos_elkema","eomanis","none"],
            "common_porcupine":["multituberculata","gomphos_elkema","eomanis","none"],
            "sunda_pangolin":["multituberculata","gomphos_elkema","eomanis","none"],
            "sumatran_striped_rabbit":["multituberculata","gomphos_elkema","eomanis","none"],
            //other mammals 3
            "malayan_tapir":["heptodon","perissodactyl","eomanis","none"],
            "sumatran_rhinoceros":["heptodon","perissodactyl","eomanis","none"]
        },
        "25_mya": {
            //plants
            "fig_tree":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "forest_durian":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "ginger":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "jambu_tree":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "meggaris_tree":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "pitcher _plant":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "rafflesia":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "tetrastigma":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "titan_arum":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            //insects
            "ant":["mesokristensenia","styporaphidia","empididae","none"],
            "fig_wasp":["mesokristensenia","styporaphidia","empididae","none"],
            "termite":["mesokristensenia","styporaphidia","empididae","none"],
            //primates
            "bornean_orangutan":["old_world_monkey","new_world_monkey","purgatorius","none"],
            "mitered_leaf_monkey":["old_world_monkey","new_world_monkey","purgatorius","none"],
            "muellers_gibbon":["old_world_monkey","new_world_monkey","purgatorius","none"],
            "proboscis_monkey":["old_world_monkey","new_world_monkey","purgatorius","none"],
            "sumatran_orangutan":["old_world_monkey","new_world_monkey","purgatorius","none"],
            "white_fronted_langur":["old_world_monkey","new_world_monkey","purgatorius","none"],
            //birds
            "blue_headed_pitta":["passeriformes","bucerotidae","phasianidae","none"],
            "garnet_pitta":["passeriformes","bucerotidae","phasianidae","none"],
            "helmeted _hornbill":["passeriformes","bucerotidae","phasianidae","none"],
            "malabar_grey_hornbill":["passeriformes","bucerotidae","phasianidae","none"],
            "great_argus_pheasant":["passeriformes","bucerotidae","phasianidae","none"],
            "rhinoceros_hornbill":["passeriformes","bucerotidae","phasianidae","none"],
            //other mammals 1
            "civet":["oligocene_rodents","felidae","asiavorator","none"],
            "sunda_clouded_leopard":["oligocene_rodents","felidae","asiavorator","none"],
            "leopard_cat":["oligocene_rodents","felidae","asiavorator","none"],
            "sumatran_tiger":["oligocene_rodents","felidae","asiavorator","none"],
            //other mammals 2
            "borneo_porcupine":["common_pangolin","palaeolagus","oligocene_rodents","none"],
            "common_porcupine":["common_pangolin","palaeolagus","oligocene_rodents","none"],
            "sunda_pangolin":["common_pangolin","palaeolagus","oligocene_rodents","none"],
            "sumatran_striped_rabbit":["common_pangolin","palaeolagus","oligocene_rodents","none"],
            //other mammals 3
            "malayan_tapir":["first_tapir","perissodactyls","common_pangolin","none"],
            "sumatran_rhinoceros":["first_tapir","perissodactyls","common_pangolin","none"]
        },
        "10_mya": {
            //plants
            "fig_tree":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "forest_durian":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "ginger":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "jambu_tree":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "meggaris_tree":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "pitcher _plant":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "rafflesia":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "tetrastigma":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "titan_arum":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            //insects
            "ant":["mesokristensenia","styporaphidia","empididae","none"],
            "fig_wasp":["mesokristensenia","styporaphidia","empididae","none"],
            "termite":["mesokristensenia","styporaphidia","empididae","none"],
            //primates
            "bornean_orangutan":["old_world_monkey","dryopithecus","new_world_monkey","none"],
            "mitered_leaf_monkey":["old_world_monkey","dryopithecus","new_world_monkey","none"],
            "muellers_gibbon":["old_world_monkey","dryopithecus","new_world_monkey","none"],
            "proboscis_monkey":["old_world_monkey","dryopithecus","new_world_monkey","none"],
            "sumatran_orangutan":["old_world_monkey","dryopithecus","new_world_monkey","none"],
            "white_fronted_langur":["old_world_monkey","dryopithecus","new_world_monkey","none"],
            //birds
            "blue_headed_pitta":["passeriformes","bucerotidae","phasianidae","none"],
            "garnet_pitta":["passeriformes","bucerotidae","phasianidae","none"],
            "helmeted _hornbill":["passeriformes","bucerotidae","phasianidae","none"],
            "malabar_grey_hornbill":["passeriformes","bucerotidae","phasianidae","none"],
            "great_argus_pheasant":["passeriformes","bucerotidae","phasianidae","none"],
            "rhinoceros_hornbill":["passeriformes","bucerotidae","phasianidae","none"],
            //other mammals 1
            "civet":["viverridae","old_world_porcupine","felidae","none"],
            "sunda_clouded_leopard":["viverridae","old_world_porcupine","felidae","none"],
            "leopard_cat":["viverridae","old_world_porcupine","felidae","none"],
            "sumatran_tiger":["viverridae","old_world_porcupine","felidae","none"],
            //other mammals 2
            "borneo_porcupine":["felidae","old_world_porcupine","common_pangolin","none"],
            "common_porcupine":["felidae","old_world_porcupine","common_pangolin","none"],
            "sunda_pangolin":["felidae","old_world_porcupine","common_pangolin","none"],
            "sumatran_striped_rabbit":["felidae","old_world_porcupine","common_pangolin","none"],
            //other mammals 3
            "malayan_tapir":["first_tapir","rhinocerotoids","palaeolagus","none"],
            "sumatran_rhinoceros":["first_tapir","rhinocerotoids","palaeolagus","none"]
        },
        "5_mya": {
            //plants
            "fig_tree":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "forest_durian":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "ginger":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "jambu_tree":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "meggaris_tree":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "pitcher _plant":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "rafflesia":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "tetrastigma":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "titan_arum":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            //insects
            "ant":["mesokristensenia","styporaphidia","empididae","none"],
            "fig_wasp":["mesokristensenia","styporaphidia","empididae","none"],
            "termite":["mesokristensenia","styporaphidia","empididae","none"],
            //primates
            "bornean_orangutan":["propliopithecus","colobinae","new_world_monkey","none"],
            "mitered_leaf_monkey":["propliopithecus","colobinae","new_world_monkey","none"],
            "muellers_gibbon":["propliopithecus","colobinae","new_world_monkey","none"],
            "proboscis_monkey":["propliopithecus","colobinae","new_world_monkey","none"],
            "sumatran_orangutan":["propliopithecus","colobinae","new_world_monkey","none"],
            "white_fronted_langur":["propliopithecus","colobinae","new_world_monkey","none"],
            //birds
            "blue_headed_pitta":["passeriformes","bucerotidae","phasianidae","none"],
            "garnet_pitta":["passeriformes","bucerotidae","phasianidae","none"],
            "helmeted _hornbill":["passeriformes","bucerotidae","phasianidae","none"],
            "malabar_grey_hornbill":["passeriformes","bucerotidae","phasianidae","none"],
            "great_argus_pheasant":["passeriformes","bucerotidae","phasianidae","none"],
            "rhinoceros_hornbill":["passeriformes","bucerotidae","phasianidae","none"],
            //other mammals 1
            "civet":["viverridae","panthera","felidae","none"],
            "sunda_clouded_leopard":["viverridae","panthera","felidae","none"],
            "leopard_cat":["viverridae","panthera","felidae","none"],
            "sumatran_tiger":["viverridae","panthera","felidae","none"],
            //other mammals 2
            "borneo_porcupine":["old_world_porcupine","asiavorator","common_pangolin","none"],
            "common_porcupine":["old_world_porcupine","asiavorator","common_pangolin","none"],
            "sunda_pangolin":["old_world_porcupine","asiavorator","common_pangolin","none"],
            "sumatran_striped_rabbit":["old_world_porcupine","asiavorator","common_pangolin","none"],
            //other mammals 3
            "malayan_tapir":["first_tapir","rhinocerotoids","palaeolagus","none"],
            "sumatran_rhinoceros":["first_tapir","rhinocerotoids","palaeolagus","none"]
        },
        "2_mya": {
            //plants
            "fig_tree":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "forest_durian":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "ginger":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "jambu_tree":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "meggaris_tree":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "pitcher _plant":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "rafflesia":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "tetrastigma":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "titan_arum":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            //insects
            "ant":["mesokristensenia","styporaphidia","empididae","none"],
            "fig_wasp":["mesokristensenia","styporaphidia","empididae","none"],
            "termite":["mesokristensenia","styporaphidia","empididae","none"],
            //primates
            "bornean_orangutan":["hylobatidae","oranutan","presbytis","none"],
            "mitered_leaf_monkey":["hylobatidae","oranutan","presbytis","none"],
            "muellers_gibbon":["hylobatidae","oranutan","presbytis","none"],
            "proboscis_monkey":["hylobatidae","oranutan","presbytis","none"],
            "sumatran_orangutan":["hylobatidae","oranutan","presbytis","none"],
            "white_fronted_langur":["hylobatidae","oranutan","presbytis","none"],
            //birds
            "blue_headed_pitta":["passeriformes","bucerotidae","phasianidae","none"],
            "garnet_pitta":["passeriformes","bucerotidae","phasianidae","none"],
            "helmeted _hornbill":["passeriformes","bucerotidae","phasianidae","none"],
            "malabar_grey_hornbill":["passeriformes","bucerotidae","phasianidae","none"],
            "great_argus_pheasant":["passeriformes","bucerotidae","phasianidae","none"],
            "rhinoceros_hornbill":["passeriformes","bucerotidae","phasianidae","none"],
            //other mammals 1
            "civet":["viverridae","panthera_palaeosinensis","clouded_leopard","none"],
            "sunda_clouded_leopard":["viverridae","panthera_palaeosinensis","clouded_leopard","none"],
            "leopard_cat":["viverridae","panthera_palaeosinensis","clouded_leopard","none"],
            "sumatran_tiger":["viverridae","panthera_palaeosinensis","clouded_leopard","none"],
            //other mammals 2
            "borneo_porcupine":["old_world_porcupine","asiavorator","common_pangolin","none"],
            "common_porcupine":["old_world_porcupine","asiavorator","common_pangolin","none"],
            "sunda_pangolin":["old_world_porcupine","asiavorator","common_pangolin","none"],
            "sumatran_striped_rabbit":["old_world_porcupine","asiavorator","common_pangolin","none"],
            //other mammals 3
            "malayan_tapir":["first_tapir","rhinocerotoid","palaeolagus","none"],
            "sumatran_rhinoceros":["first_tapir","rhinocerotoid","palaeolagus","none"]
        }
    },
    
    meetupTopics: {
        "TiffanyGot": {"1": "The pittas differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.", "2": "The pittas differentiated at 5 mya. What did you see happen in the previous time period (i.e., 10 mya) with other species or the environment that could explain this differentiation?"},
        "MichaelKim": {"1": "The pheasant differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.", "2": "The pheasant differentiated at 10 mya. What did you see happen in the previous time period (i.e., 25 mya) with other species or the environment that could explain this differentiation?"},
        "AlinaMa":{"1":"Fig wasps differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"Did plants differentiate very much between 25 mya and 2 mya? Could this have an effect on the evolutionary processes of the other species? Briefly explain your answer."},
        "EliOtis":{"1":"The porcupines differentiated at 100 mya. What did you see happen in the previous time period (i.e., 150 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The cats differentiated at 2 mya. What did you see happen in the previous time period (i.e., 5 mya) with other species or the environment that could explain this differentiation?"},
        "SydneyMacDonald":{"1":"Primates differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the  other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"When did the apes differentiate from old world monkeys? What did you see happen in the previous time period with other species or the environment that could explain this differentiation?"},
        "QuentinWong":{"1":"The hornbills differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The hornbills differentiated at 2 mya. What did you see happen in the previous time period (i.e., 5 mya) with other species or the environment that could explain this differentiation?"},
        "MithRavindran":{"1":"Many plants differentiated at 100 mya. What did you see happen in the previous time period (i.e., 50 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"Did insects differentiate very much between 25 mya and 2 mya? Could this have an effect on the evolutionary processes of the other species? Briefly explain your answer."},
        "AaronShafton":{"1":"Fig wasps differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"Did plants differentiate very much between 25 mya and 2 mya? Could this have effects on the evolutionary processes of the other species? Briefly explain your answer."},
        "HaileyScott":{"1":"Many mammals differentiated at 100 mya. What did you see happen in the previous time period (i.e., 50 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The tapir differentiated at 5 mya. What did you see happen in the previous time period (i.e., 10 mya) with other species or the environment that could explain this differentiation?"},
        "JannisMei":{"1":"Primates differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the  other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The gibbon differentiated at 5 mya. What did you see happen in the previous time period (i.e., 10 mya) with other species or the environment that could explain this differentiation?"},
        "CatharineSolomon":{"1":"The pheasant differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The hornbills differentiated at 2 mya. What did you see happen in the previous time period (i.e., 5 mya) with other species or the environment that could explain this differentiation?"},
        "KevinPark":{"1":"The pittas differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The pittas differentiated at 5 mya. What did you see happen in the previous time period (i.e., 10 mya) with other species or the environment that could explain this differentiation?"},
        "KarimNoormohamed":{"1":"Many plants differentiated at 100 mya. What did you see happen in the previous time period (i.e., 50 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"Did insects differentiate very much between 25 mya and 2 mya? Could this have an effect on the evolutionary processes of the other species? Briefly explain your answer."},
        "AimeeHe":{"1":"Fig wasps differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"Did plants differentiate very much between 25 mya and 2 mya? Could this have effects on the evolutionary processes of the other species? Briefly explain your answer."},
        "JasonWestonWong":{"1":"The porcupines differentiated at 100 mya. What did you see happen in the previous time period (i.e., 150 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The tapir differentiated at 5 mya. What did you see happen in the previous time period (i.e., 10 mya) with other species or the environment that could explain this differentiation?"},
        "ClaraBanKim":{"1":"Primates differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the  other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"When did the apes differentiate from old world monkeys? What did you see happen in the previous time period with other species or the environment that could explain this differentiation?"},
        "EilishSibalis":{"1":"The hornbills differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The pheasant differentiated at 10 mya. What did you see happen in the previous time period (i.e., 25 mya) with other species or the environment that could explain this differentiation?"},
        "ColeJackes":{"1":"Fig wasps differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"Did insects differentiate very much between 25 mya and 2 mya? Could this have an effect on the evolutionary processes of the other species? Briefly explain your answer."},
        "ReenaZhan":{"1":"Many mammals differentiated at 100 mya. What did you see happen in the previous time period (i.e., 50 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The cats differentiated at 2 mya. What did you see happen in the previous time period (i.e., 5 mya) with other species or the environment that could explain this differentiation?"},
        "AuroraBasinskiFerris":{"1":"Primates differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the  other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The gibbon differentiated at 5 mya. What did you see happen in the previous time period (i.e., 10 mya) with other species or the environment that could explain this differentiation?"},
        "DanielHenkeTarnow":{"1":"The primates shared a common ancestor with other mammals. Describe this ancestor organism and the conditions that allowed it to evolve. Remember to identify the time periods involved.","2":"When did the apes differentiate from old world monkeys? What did you see happen in the previous time period with other species or the environment that could explain this differentiation?"},
        "":{"1":"","2":""}
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
                    console.log("observations_start event received, but payload is incomplete or not for this user");
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

            meetup_start: function(ev) {
                Sail.app.hidePageElements();
                // distinguish between meetups by looking at rotation
                if (EvoRoom.rotation === 1 || EvoRoom.rotation === 2) {
                    // write topic 1 or 2 in HTML
                    //$('#meetup .topic').text(Sail.app.user_metadata['meetup_'+EvoRoom.rotation+'_topic']);
                    $('#meetup .topic').text(EvoRoom.meetupTopics[Sail.app.session.account.login][EvoRoom.rotation]);
                    $('#meetup-instructions').show();
                } else {
                    console.warn("Event meetup_start caught and EvoRoom.rotation is: '"+EvoRoom.rotation+"' - should be 1 or 2");
                }
            },

            homework_assignment: function(ev) {
                if (Sail.app.user_metadata.day === "2" && ev.payload) {
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
                Sail.app.user_metadata = data.user.metadata;

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
            Sail.app.user_metadata = null;
            EvoRoom.rotation = null;
            EvoRoom.currentTeam = null;
            EvoRoom.assignedLocation = null;
            EvoRoom.currentLocation = null;
            EvoRoom.selectedOrganism = null;
            EvoRoom.buttonRevealCounter = 0;


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
        .load('Rollcall.Authenticator', {mode: 'picker', askForRun: true, curnit: 'EvoRoom3', userFilter: function(u) {return true; /*u.kind == "Student"*/}})
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
        $('#is-organism-present .small-button').hide();
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
        $('#day2-complete').hide();

    },

    setupPageLayout: function() {
        // using each() now to iterate over the members and creating div's on the fly
        $('#team-assignment .members').html('');
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

        $('.organism-clear').html('');
        while (j < organismArray.length) {
            j++;
            $('#organism-assignment .assigned-organism-'+j).text(Sail.app.formatOrganismString(organismArray[j-1]));
            $('#team-organism-assignment-day2 .assigned-organism-'+j).text(Sail.app.formatOrganismString(organismArray[j-1]));
        }

        $('.jquery-radios').buttonset();

        // check which day it is
        if (Sail.app.user_metadata.day === "2") {
            $('#log-in-success-day2').show();
        }
        else { 
            $('#log-in-success').show();
        }

        // hide the organism in the top right (this hide is only necessary if there's a crash)
        $('#student-chosen-organisms').hide();

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
            if (Sail.app.user_metadata.day === "2") {
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
            //Sail.app.currentLocation = "station_a";
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

        $('#is-organism-present .radio').click(function() {
            $('#is-organism-present .small-button').show();
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
            if ($('#meetup .meetup-text-entry').val() === '') {
                alert('Please enter your answer in the text box below');
            }
            else {
                Sail.app.hidePageElements();
                Sail.app.submitNote();

                // clear text in preparation for rotation 2
                $('#meetup .meetup-text-entry').val('');
                $('#loading-page').show();
            }
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
            if ($('#2mya-organism-details .2mya-organism-details-text-entry').val() === '') {
                alert('Please enter your answer in the text box below');
            }
            else {
                Sail.app.hidePageElements();
                Sail.app.submitOrganismFeatures();

                // clear text entry field
                $('#2mya-organism-details .2mya-organism-details-text-entry').val('');
                $('#2mya-choose-organisms').show();

                // clear the organism out of the top corner
                $('#student-chosen-organisms').hide();
            }
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
            var observation_table = [];
            $('#present-day-organisms .present-day-organisms-table tr').each(function (index) {
                //observation_table[$(this).attr('data-organism')] = $(this).attr('data-choice');
                var observation = {};
                observation['organism'] = $(this).attr('data-organism');
                observation['is_present'] = $(this).attr('data-choice');
                observation_table.push(observation);
            });
            // hide everything
            Sail.app.hidePageElements();

            // send out observation_tabulation
            EvoRoom.submitObservationTabulation(observation_table);

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

        // START HERE
        $('#concepts-discussion .time-period-pop-up-button').click(function() {
            $('#time-period-pop-up').show();
        });

        $('#concepts-discussion .small-button').click(function() {
            $('#time-period-pop-up').hide();
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
            specialty:Sail.app.user_metadata.specialty
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
            if (Sail.app.user_metadata.day === "2") {
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
            // distinguish between meetups by looking at rotation
            if (EvoRoom.rotation === 1 || EvoRoom.rotation === 2) {
                // write topic 1 or 2 in HTML
                //$('#meetup .topic').text(Sail.app.user_metadata['meetup_'+EvoRoom.rotation+'_topic']);
                $('#meetup .topic').text(EvoRoom.meetupTopics[Sail.app.session.account.login][EvoRoom.rotation]);
                $('#meetup-instructions').show();
            } else {
                console.warn("Restore state MEETUP and EvoRoom.rotation is: '"+EvoRoom.rotation+"' - should be 1 or 2");
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
        // hide everything
        Sail.app.hidePageElements();
        // check if checkin to room
        if (result === "room") {
            // send out event check_in
            Sail.app.currentLocation = result;
            Sail.app.submitCheckIn();

            // check which day it is
            if (Sail.app.user_metadata.day === "2") {
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
        return JSON.parse(Sail.app.user_metadata.assigned_organisms);
    },

    calculateYear: function() {
        if (Sail.app.rotation === 1) {
            if (Sail.app.currentLocation === "station_a") {
                Sail.app.currentYear = "200_mya";
                return "200 mya";
            }
            else if (Sail.app.currentLocation === "station_b") {
                Sail.app.currentYear = "150_mya";
                return "150 mya";
            }
            else if (Sail.app.currentLocation === "station_c") {
                Sail.app.currentYear = "100_mya";
                return "100 mya";
            }
            else if (Sail.app.currentLocation === "station_d") {
                Sail.app.currentYear = "50_mya";
                return "50 mya";
            }
            else {
                console.log("year or station strings are missing, can't calculate year");
                return "unknown time";
            }
        }
        else if (Sail.app.rotation === 2) {
            if (Sail.app.currentLocation === "station_a") {
                Sail.app.currentYear = "25_mya";
                return "25 mya";
            }
            else if (Sail.app.currentLocation === "station_b") {
                Sail.app.currentYear = "10_mya";
                return "10 mya";
            }
            else if (Sail.app.currentLocation === "station_c") {
                Sail.app.currentYear = "5_mya";
                return "5 mya";
            }
            else if (Sail.app.currentLocation === "station_d") {
                Sail.app.currentYear = "2_mya";
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
            return "Blue-headed pitta";
        } else if (organismString === "bornean_orangutan") {
            return "Bornean orangutan";
        } else if (organismString === "borneo_porcupine") {
            return "Borneo porcupine";
        } else if (organismString === "civet") {
            return "Civet";
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
        } else if (organismString === "great_argus_pheasant") {
            return "Great argus pheasant";
        } else if (organismString === "helmeted_hornbill") {
            return "Helmeted hornbill";
        } else if (organismString === "jambu_tree") {
            return "Jambu tree";
        } else if (organismString === "leopard_cat") {
            return "Leopard cat";
        } else if (organismString === "malabar_grey_hornbill") {
            return "Malabar grey hornbill";
        } else if (organismString === "malayan_tapir") {
            return "Malayan tapir";
        } else if (organismString === "meggaris_tree") {
            return "Meggaris tree";
        } else if (organismString === "mitered_leaf_monkey") {
            return "Mitered leaf monkey";
        } else if (organismString === "muellers_gibbon") {
            return "Mueller's gibbon";
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
        } else if (organismString === "sumatran_striped_rabbit") {
            return "Sumatran striped rabbit";
        } else if (organismString === "sumatran_tiger") {
            return "Sumatran tiger ";
        } else if (organismString === "sunda_clouded_leopard") {
            return "Sunda clouded leopard";
        } else if (organismString === "sunda_pangolin") {
            return "Sunda pangolin";
        } else if (organismString === "termite") {
            return "Termite";
        } else if (organismString === "tetrastigma") {
            return "Tetrastigma";
        } else if (organismString === "titan_arum") {
            return "Titan arum";
        } else if (organismString === "white_fronted_langur") {
            return "White fronted langur";
        } else if (organismString === "none") {
            return "None of the above";
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

        if (Sail.app.user_metadata.day === "2") {
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
            if (Sail.app.user_metadata.day === "2") {
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

            // add the image, add the text and determine whether to add a new row or cell
            td.append(img);
            td.append('<div class="small-font">' + Sail.app.formatOrganismString(org) + '</div>');

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
        var yearString = Sail.app.currentYear;
        var ancestorsYearObject = $.extend(true, {}, Sail.app.ancestors);


        // for the first ancestor table
        if (selector === "partial") {
            $('.ancestor-information-table').html('');
            table = $('.ancestor-information-table');
            ancestorsYearObject[yearString][animal].pop();
        }
        // for the second ancestor table
        else if (selector === "full") {
            $('.choose-ancestor-table').html('');
            table = $('.choose-ancestor-table');
        }
        else {
            console.log('error creating ancestor tables - missing selector');
        }

        _.each(ancestorsYearObject[yearString][animal], function(org) {
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
                    $('#ancestor-information-details .ancestor-description').text(Sail.app.formatOrganismString(Sail.app.ancestorsText[ancestorChosenString]));
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

            td.append(img);
            td.append('<div class="small-font">' + Sail.app.formatOrganismString(org) + '</div>');


            if (k%2 !== 0) {
                tr = $('<tr />');
            }

            tr.append(td);

            if (k%2 === 0) {
                table.append(tr);
            }
        });
        // finish the table
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


            $('.organism-text', this).text(Sail.app.formatOrganismString(currentOrganisms[index]));


            // remove any excess row
            if (index >= currentOrganisms.length) {
                $(this).remove();
            }
        });
    }
};
