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
        "archaeopteryx":"An Early Bird, dating from about 150 million years ago during the Jurassic period, when many dinosaurs lived. Archaeopteryx is considered by many to be the first bird, being of about 150 million years of age. It is actually intermediate between the birds that we see flying around in our backyards and the predatory dinosaurs like Deinonychus. \n Archaeopteryx was a transitional form between birds and reptiles, and seemed to be part bird and part dinosaur. It bears even more resemblance to its ancestors, the Maniraptora, than to modern birds; providing a strong phylogenetic link between the two groups. Unlike modern-day birds, it had teeth, three claws on each wing, a flat sternum (breastbone), belly ribs (gastralia), and a long, bony tail. Like modern-day birds, it had feathers, a lightly-built body with hollow bones, a wishbone (furcula) and reduced fingers. This crow-sized animal may have been able to fly, but not very far and not very well. Although it had feathers and could fly, it had similarities to dinosaurs, including its teeth, skull, lack of a horny bill, and certain bone structures.",
        "asiavorator":"Asiavorator is an extinct species of carnivorous, cat-like civet endemic to Asia. The teeth of Asiavorator suggest that the beasts were omnivorous or more precisely, ranged from hypercarnivorous to mesocarnivorous.",
        "bucerotidae":"Hornbills (Bucerotidae) are a family of bird found in tropical and subtropical Africa, Asia and Melanesia. They are characterized by a long, down-curved bill which is frequently brightly-colored and sometimes has a casque on the upper mandible. Both the common English and the scientific name of the family refer to the shape of the bill, 'buceros' being 'cow horn' in Greek. In addition, they possess a two-lobed kidney. Hornbills are the only birds in which the first two neck vertebrae (the axis and atlas) are fused together; this probably provides a more stable platform for carrying the bill. The family is omnivorous, feeding on fruit and small animals. They are monogamous breeders nesting in natural cavities in trees and sometimes cliffs. A number of species of hornbill are threatened with extinction, mostly insular species with small ranges. \n Hornbills show considerable variation in size as a family, ranging in size from the Black Dwarf Hornbill (Tockus hartlaubi), at 102 grams (3.6 oz) and 30 cm (1 foot), to the Southern Ground Hornbill (Bucorvus leadbeateri), at up to 6.2 kg (13.6 lbs) and 1.2 m (4 feet). Males are always bigger than the females, though the extent to which this is true varies dependent upon species.",
        "chrysomeloidea":"Chrysomeloidea is an enormous superfamily of beetles. There are tens of thousands of species, mostly in the families Cerambycidae (the long-horned beetles) and Chrysomelidae, the leaf beetles.",
        "cicadellidae":"Leafhopper is a common name applied to any species from the family Cicadellidae. Leafhoppers, colloquially known as hoppers, are minute plant-feeding insects in the superfamily Membracoidea in the order Homoptera. They belong to a lineage traditionally treated as infraorder Cicadomorpha in the suborder Auchenorrhyncha, but as the latter taxon is probably not monophyletic, many modern authors prefer to abolish the Auchenorrhyncha and elevate the cicadomorphs to a suborder Clypeorrhyncha. Leafhoppers are found all over the world, and constitute the second-largest hemipteran family. They have at least 20,000 described species. The tribe Proconiini of the subfamily Cicadellinae is commonly known as sharpshooters.",
        "clouded_leopard":"About two million years ago, the clouded leopard (Neofelis nebulosa) appeared, and the big cats evolved in increasingly larger sizes to hunt increasingly larger prey. Most of the big cats were very successful at establishing their colonies. In the Old World, the leopards were quite widespread, while in the New World, the jaguar managed to colonize most of the forested areas in the Americas except in the far north, thus competing with the deer-sized prey with the puma.",
        "colobinae":"Colobinae (also called Leaf Monkey) is a subfamily of the Old World monkey family that includes 59 species in 10 genera, including the skunk-like black-and-white colobus, the large-nosed proboscis monkey, and the gray langurs. Some classifications split the colobine monkeys into two tribes, while others split them into three groups. Both classifications put the three African genera Colobus, Piliocolobus, and Procolobus in one group; these genera are distinct in that they have a stub thumb. The various Asian genera are placed into another one or two groups. Analysis of mtDNA confirms that the Asian species form two distinct groups, one of langurs and the other of the 'odd-nosed' species, but suggests that the gray langurs are not closely related to either.",
        "common_pangolin":"A pangolin, also scaly anteater or Trenggiling, is a mammal of the order Pholidota. There is only one extant family (Manidae) and one genus (Manis) of pangolins, comprising eight species. There are also a number of extinct taxa. Pangolins have large keratin scales covering their skin and are the only mammals with this adaptation. They are found in tropical regions of Africa and Asia. The name 'pangolin' derives from the Malay word pengguling ('something that rolls up'). Pangolins are nocturnal animals, and use their well-developed sense of smell to find insects. The long-tailed pangolin is also active by day. Pangolins spend most of the daytime sleeping, curled up into a ball.",
        "crusafonta":"A nearly complete fossil of this mammal was recently found in rich fossil deposits in Portugal. It was about 8 inches long, shows adaptations for living in the trees, leaping from branch to branch, and feeding on insects and fruits.",
        "cupedidae":"Cupedidae is a small family of beetles, notable for the square pattern of 'windows' on their elytra (hard forewings), which gives the family their common name of reticulated beetles. The family consists of about 30 species in nine genera, with a Pangean (worldwide) distribution. Many more extinct species are known, dating as far back as the Triassic. These beetles tend to be elongate with a parallel-sided body, ranging in size from 5 to 25 mm, with colors brownish, blackish, or gray. The larvae are wood-borers, typically living in fungus-infested wood, and sometimes found in wood construction.",
        "cycadeoidea_marylandica":"Cycadeoidea marylandica is an extinct plant that looks like modern cycads. It dates to the Cretaceous period, 105 million years ago. Cycads are an ancient group of seed plants with a crown of large compound leaves and a stout trunk. They are a minor component of the flora in tropical and subtropical regions today, but during the Jurassic Period, they were a common sight in many parts of the world. For this reason, the Jurassic is often referred to as the 'Age of Cycads'.",
        "cycad":"Cycads are an ancient group of seed plants with a crown of large compound leaves and a stout trunk. They are a minor component of the flora in tropical and subtropical regions today, but during the Jurassic Period, they were a common sight in many parts of the world. For this reason, the Jurassic is often referred to as the 'Age of Cycads'. Today only a handful of cycads still exist, and many are facing possible extinction in the wild (such as Microcycas in western Cuba). They are scattered around the globe but are restricted to tropical or subtropical climates.",
        "dryopithecus":"Dryopithecus was a genus of apes that is known from Eastern Africa into Eurasia during the late Miocene period. Apes apparently evolved from monkeys early in the Miocene epoch. Dryopithecus was about 60 centimetres (24 in) in body length, and more closely resembled a monkey than a modern ape. The structure of its limbs and wrists show that it walked in a similar way to modern chimpanzees, but that it used the flat of its hands, like a monkey, rather than knuckle-walking, like modern apes. Its face exhibited klinorhynchy, with its face being tilted downwards in profile. It likely spent most of its life in trees, and was probably a brachiator, similar to modern orangutans and gibbons. Its molars had relatively little enamel, suggesting that it ate soft leaves and fruit, an ideal food for a tree-dwelling animal.",
        "early_sphecoid_wasp":"Solitary wasps evolved from vespoid wasps. The first bees probably evolved from the sphecoid wasps around 30 million years ago while honeybees had largely stabilised into their present forms about 27 million years ago. The evolution of bees is closely linked with the development of flowering plants with the insects acting as a pollen transfer vehicle in a relationship which benefits both pollinator and plant. Over the period of their evolution honeybees have moved to a complex social society from solitary and then communal living antecedents.",
        "empididae":"Empididae is a family of flies with over 3,000 described species occurring worldwide, but the majority are found in the Holarctic. They are mainly predatory flies like most of their relatives in the Empidoidea, and exhibit a wide range of forms but are generally small to medium sized, non-metallic and rather bristly. Common names for members of this family are dagger flies (referring to the sharp piercing mouthparts of some species) and balloon flies. The term 'dance flies' is sometimes used for this family too, but the dance flies proper, formerly included herein, are now considered a separate family Hybotidae. Some Empididae, such as the European species Hilara maura, have an elaborate courtship ritual in which the male wraps a prey item in silk and presents it to the female to stimulate copulation. Empidid larvae are also largely predatory (although some are scavengers) and occupy a wide range of habitats, both aquatic and terrestrial.",
        "enantiornithe":"Enantiornithes is an extinct group of primitive birds. They were the most abundant and diverse avialans of the Mesozoic. Almost all retained teeth and clawed fingers on each wing, but otherwise looked much like modern birds externally. Over 50 species of Enantiornithines have been named, but some names represent only single bones, so it is likely that not all are valid. Enantiornithine birds went extinct at the K-Pg boundary, along with hesperornithine birds and all other non-avian dinosaurs, and many other mostly reptilian life forms. Enantiornithines are thought to have left no living descendants.",
        "eomaia":"Eomaia is an extinct fossil mammal, discovered in rocks that were found in the Yixian Formation, Liaoning Province, China, and dated to the Barremian Age of the Lower Cretaceous about 125 million years ago.1 The fossil is 10 centimetres (3.9 in) in length and virtually complete. An estimate of the body weight is between 20–25 grams (0.71–0.88 oz). It is exceptionally well-preserved for a 125-million-year-old specimen. Although the fossil's skull is squashed flat, its teeth, tiny foot bones, cartilages and even its fur are visible.",
        "eomanis":"Eomanis ('primitive ghost') is the earliest known true (and scaled) pangolin from the Middle Eocene of Europe. Fossils collected from the Messel Pit, Germany, indicate that this 50 cm long animal was rather similar to living pangolins. However, unlike modern pangolins, its tail and legs did not bear scales. According to the stomach contents of the excellently preserved Messel specimens, Eomanis’ diet consisted of both insects and plants. Its contemporary was the related, albeit scale-less, anteater-like Eurotamandua.",
        "felidae":"Felidae is the biological family of the cats; a member of this family is called a felid. Felids are the strictest carnivores of the thirteen terrestrial families in the order Carnivora, although the three families of marine mammals comprising the superfamily pinnipedia are as carnivorous as the felids. The most familiar felid is the domestic cat, which first became associated with humans about 10,000 years ago, but the family includes all other wild cats including the big cats. Extant felids belong to one of two subfamilies: Pantherinae (which includes the tiger, the lion, the jaguar, and the leopard), and Felinae (which includes the cougar, the cheetah, the lynxes, the ocelot, and the domestic cat).",
        "first_tapir":"A Tapir is a large browsing mammal, similar in shape to a pig, with a short, prehensile snout. Tapirs inhabit jungle and forest regions of South America, Central America, and Southeast Asia. There are four species of Tapirs: the Brazilian Tapir, the Malayan Tapir, Baird's Tapir and the Mountain Tapir. All four species of tapir are classified as endangered or vulnerable. Their closest relatives are the other odd-toed ungulates, including horses and rhinoceroses.",
        "ginkgophyta":"Phylum of seed plants represented by one living species, Ginkgo biloba. This species is restricted to China where it may be extinct in the wild. The group was well represented during the Mesozoic with worldwide distribution. They are deciduous trees bearing distinctive fan-shaped leaves. Branches with numerous spur shoots that bear the reproductive structures. Stems with extensive secondary growth producing considerable secondary xylem.",
        "gomphos_elkema":"Gomphos is an extinct genus of early lagomorph from the early Eocene some 55 million years ago of China and Mongolia. The type species is G. elkema.",
        "hadrocodium":"The recent discovery of this 195 million year old fossil has added another member to the early mammal family during this time period. Hadrocodium weighed only two grams and grew to a length of 32 millimetres. It has the large grain and middle ear of modern mammals, traits that suggest these two features may have evolved together.",
        "heptodon":"Heptodon is an extinct genus of tapir-type herbivore of the family Helaletidae endemic to North America during the Eocene epoch. It lived from 55.4 to 48.6 mya, existing for approximately 6.8 million years. Heptodon was about 1 metre (3.3 ft) in length, and closely resembled modern tapirs. The shape of the skull suggests that it probably lacked the characteristic tapir trunk. Instead it probably had a slightly elongated, fleshy upper lip, like its relative Helatetes.",
        "common_gibbon":"Often treated as representing an ancestral gibbon or at least a good morphological antecedent, this family contains 1 genus, Hylobates, and approximately 11 species (some authorities recognize a second genus, Symphalangus). They are found only in the tropical forests of southeastern Asia, including on Sumatra, Borneo, Java, and other islands as well as the mainland. These apes are of medium size (3.9-12.7 kg). They lack tails. Their forearms are remarkably long, and both forefeet and hindfeet are long and thin. The forefeet have a deep cleft between first and second digits. \n Gibbons and siamangs are monogamous, living in small family troops of usually 2-6 related individuals. These groups are territorial, maintaining their territories partly by conspicuous vocalization, which may involve loud duetting by group members. They are primarily vegetarian, feeding on figs and other fruit, leaves and shoots. They are remarkably active and agile brachiators, capable of exceeding 3m in a swing. Gibbons leap from branch to branch, sometimes travelling more than 9 m in a single leap. They also sometimes walk on large branches or on ground, assuming a bipedal stance with their arms raised for balance. Gibbons are active during the day.",
        "lycophyte":"The lycophytes are a small and inconspicuous group of plants today, but in the Carboniferous some lycophytes were forest-forming trees more than 35 meters tall. Lycophytes are the oldest extant group of vascular plants, and dominated major habitats for 40 million years. Plants with true leaves, roots and stems. Leaves are, without exception, microphylls and this is a defining feature of the group (hence, the alternate name for the phylum - the Microphyllophyta). Microphylls have only one vein and are not associated with a leaf gap. They are thought not to be homologous to macrophylls found in ferns and all the groups of seed plants. Roots are adventitious. Branching in both shoot and root occurs by the division of the apical meristem into two parts which can either be equal or with one subordinate and one superior branch. Living members are all herbaceous although Isoetes has secondary growth. Extinct members include tree-like plants which were a prominent part of the Carboniferous swamp-forests and are well represented in the fossil record. They are non-seed plants which are either homosporous with exosporic gametophytes or heterosporous with endosporic gametophytes.",
        "mastotermitidae":"Giant Northern termites of Australia and extinct relatives. Entomologists have been intrigued by Mastotermes electrodominicus because it shares anatomical similarities with cockroaches, leading to the theory that Mastotermes was the missing evolutionary link between termites and cockroaches. In 1992, a team of Museum scientists sampled DNA from a specimen of Mastotermes similar to the one pictured here and learned that cockroaches and Mastotermes have a common ancestor that's much older than the ancestor that gave rise to Mastotermes and its termite relatives.",
        "mesokristensenia":"Mesokristensenia is an extinct genus of moth in the family Mesokristenseniidae. It existed in what is now China during the middle Jurassic period. Currently, three species are known. They were discovered in the Middle Jurassic Jiulongshan Formation, Daohugou beds (in Inner Mongolia). The new family could represent the sister group of the Micropterigidae. Mesokristensenia differs from all extant Lepidoptera, but one genus, Agathiphaga (Agathiphagidae), in retaining four median veins in the forewing.",
        "miacid":"Miacids (Miacidae) were primitive carnivores which lived during the late Paleocene and Eocene epochs about 62 to 33 million years ago. Miacids existed for approximately 29 million years. \n Miacids are thought to have evolved into today's modern carnivorous mammals of the order Carnivora. They were small carnivores, superficially marten-like or civet-like with long, little bodies and long tails. Some species were arboreal while others lived on the ground. They probably fed on invertebrates, lizards, birds, and smaller mammals like shrews and opossums. Their teeth and skulls show that the miacids were less developed than modern carnivorans. They had carnivoran-type carnassials but lacked fully ossified auditory bullae (rounded protrusions).",
        "multituberculata":"The Multituberculata were a group of rodent-like mammals that existed for approximately one hundred and twenty million years, the longest fossil history of any mammal lineage, but were eventually outcompeted by rodents, becoming extinct during the early Oligocene. At least 200 species are known, ranging from mouse-sized to beaver-sized. These species occupied a diversity of ecological niches, ranging from burrow-dwelling to squirrel-like arborealism. Multituberculates are usually placed outside either of the two main groups of living mammals—Theria, including placentals and marsupials, and Monotremata—but some cladistic analyses put them closer to Theria than to monotremes.",
        "new_world_monkey":"New World monkeys are the five families of primates that are found in Central and South America: Callitrichidae, Cebidae, Aotidae, Pitheciidae, and Atelidae. The five families are ranked together as the Platyrrhini parvorder and the Ceboidea superfamily, which are essentially synonymous since Ceboidea is the only living platyrrhine superfamily. They differ from other groupings of monkeys and primates, such as the Old World monkeys and the apes. New World monkeys differ slightly from Old World monkeys in several aspects. The most prominent phenotype distinction is the nose, which is the feature used most commonly to distinguish between the two groups. The scientific name for the New World monkeys, Platyrrhini, means 'flat nosed'. The noses of New World monkeys are flatter than the narrow noses of the Old World monkeys, and have side-facing nostrils. New World monkeys are the only monkeys with prehensile tails—in comparison with the shorter, non-grasping tails of the anthropoids of the Old World.",
        "old_world_monkey":"The Old World monkeys or Cercopithecidae are a group of primates, falling in the superfamily Cercopithecoidea in the clade Catarrhini. The Old World monkeys are native to Africa and Asia today, inhabiting a range of environments from tropical rain forest to savanna, shrubland and mountainous terrain, and are also known from Europe in the fossil record. However, a (possibly introduced) free-roaming group of monkeys still survives in Gibraltar (Europe) to this day. Old World monkeys include many of the most familiar species of nonhuman primates, such as baboons and macaques.",
        "old_world_porcupine":"The Old World porcupines, or Hystricidae, are large terrestrial rodents, distinguished by the spiny covering from which they take their name. They range over the south of Europe, most of Africa, India, and the Maritime Southeast Asia as far east as Borneo. Although both the Old World and New World porcupine families belong to the Hystricognathi branch of the vast order Rodentia, they are quite different and are not closely related.",
        "oligocene_rodent":"The caviomorph rodents (e.g. Porcupines, capybaras, chinchillas, and a wide assortment of smaller forms), was the only group of rodents in South America until the Plio-Pleistocene.",
        "oranutan":"Pleistocene remains from China and Sumatra suggest that some oranutans were considerable larger than those of today, possibly even exceeding the gorilla in size. Orangutans are the only exclusively Asian genus of extant great ape. The largest living arboreal animals, they have proportionally longer arms than the other, more terrestrial, great apes. They are among the most intelligent primates and use a variety of sophisticated tools, also making sleeping nests each night from branches and foliage. Their hair is typically reddish-brown, instead of the brown or black hair typical of other great apes. Native to Indonesia and Malaysia, orangutans are currently found only in rainforests on the islands of Borneo and Sumatra, though fossils have been found in Java, the Thai-Malay Peninsula, Vietnam and Mainland China. There are only two surviving species, both of which are endangered: the Bornean Orangutan (Pongo pygmaeus) and the critically endangered Sumatran Orangutan (Pongo abelii).",
        "palaeolagus":"Palaeolagus is an extinct genus of lagomorph. Palaeolagus lived in the Oligocene period which was about 33-23 million years ago. The earliest leporids described from the fossil record of North America and Asia date to the upper Eocene some 40 million years ago. Selective pressure ostensibly drove them to become ever faster and better at running and jumping. Other fossil finds from Asia indicate more primitive progenitors of Palaeolagus existed in the lower Eocene; this pushes the likely date of divergence of rabbit-like and rodent-like lagomorphs back to more than 50 million years ago.",
        "panthera":"Panthera is a genus of the family Felidae (cats), which contains four well-known living species: the tiger, the lion, the jaguar, and the leopard. The genus comprises about half of the Pantherinae subfamily, the big cats. The word panther, while technically referring to all members of the genus, is commonly used to specifically designate the black panther. \n Panthera likely evolved in Asia, but the definite roots of the genus remain unclear. The divergence of the pantherine cats (including the living genera Panthera, Uncia, and Neofelis) from the subfamily Felinae (including all other living cat species) has been ranked between six and ten million years ago. The clouded leopard (Neofelis nebulosa), which was divided in 2007 to distinguish the Bornean clouded leopard (Neofelis diardi), is generally placed at the basis of the Panthera group but is not included in the genus Panthera itself.",
        "passeriform":"Sometimes known as perching birds or, less accurately, as songbirds, the passerines form one of the most diverse terrestrial vertebrate orders: with over 5,000 identified species,1 it has roughly twice as many species as the largest of the mammal orders, the Rodentia. It contains over 110 families, the second most of any order of vertebrates (after the Perciformes). \n The names 'passerines' and 'Passeriformes' are derived from Passer domesticus, the scientific name of the type species, the House Sparrow, and ultimately from the Latin term passer for Passer sparrows and similar small birds. \n The evolutionary history of the passerine families and the relationships among them remained rather mysterious until the late 20th century. In many cases, passerine families were grouped together on the basis of morphological similarities which, it is now believed, are the result of convergent evolution, not a close genetic relationship. For example, the 'wrens' of the northern hemisphere, those of Australia, and those of New Zealand look very similar and behave in similar ways, and yet belong to three far-flung branches of the passerine family tree; they are as unrelated as it is possible to be while remaining Passeriformes.",
        "perissodactyl":"Odd-toed ungulates comprise the order Perissodactyla. The middle toe on each hoof is usually larger than its neighbours. Odd-toed ungulates are relatively large grazers and, unlike the ruminant even-toed ungulates (artiodactyls), they have relatively simple stomachs because they are hindgut fermenters, digesting plant cellulose in their intestines rather than in one or more stomachs. Odd-toed ungulates include the horse, tapirs, and rhinoceroses. Although no certain fossils are known prior to the early Eocene, the odd-toed ungulates probablycitation needed arose in what is now Asia during the late Paleocene, less than 10 million years after the Cretaceous-Tertiary extinction event. By the start of the Eocene (55 million years ago) they had diversified and spread out to occupy several continents. Horses and tapirs both evolved in North America; rhinoceroses appear to have developed in Asia from tapir-like animals and then recolonised the Americas during the middle Eocene (about 45 million years ago). \n Perissodactyls were the dominant group of large terrestrial browsers right through the Oligocene. However, the rise of grasses in the Miocene (about 20 million years ago) saw a major change: the even-toed ungulates with their more complex stomachs were better able to adapt to a coarse, low-nutrition diet, and soon rose to prominence. Nevertheless, many odd-toed species survived and prospered until the late Pleistocene (about 10,000 years ago) when they faced the pressure of human hunting and habitat change.",
        "phasianidae":"The Phasianidae is a family of birds which consists of the pheasants and partridges, including the junglefowl (including chicken), Old World Quail, francolins, monals and peafowl. The family is a large one, and is occasionally broken up into two subfamilies, the Phasianinae, and the Perdicinae. Sometimes additional families and birds are treated as being in this family as well; the American Ornithologists' Union includes Tetraonidae (the grouse), Numididae (guineafowls), and Meleagrididae (turkeys) in Phasianidae as subfamilies. The earliest fossil records of phasianids date to the late Oligocene epoch, about 30 million years ago.",
        "pinaceae":"Pinophyta are monoecious trees with spirally arranged leaves. They essentially belong to an evergreen group though Larix is deciduous. The group ranges throughout the northern hemisphere and is extensively planted in the southern, which includes ecologically and economically important genera including pine, spruce, hemlock and Douglas fir. The Pinaceae are resinous trees or rarely shrubs comprising about 9 genera and 225 species found mostly in temperate regions of the Northern Hemisphere. The leaves are spirally disposed and are linear and needlelike.",
        "presbytis":"The surilis are a group of Old World monkeys and make up the entirety of the genus Presbytis. They live in the Thai-Malay Peninsula, on Sumatra, Borneo, Java and smaller nearby islands. Surilis are rather small, slim built primates. Their fur at the top is brown, grey, black or orange, and at the lower surface whitish or greyish, sometimes also orange, with some species having fur designs at the head or at the hips.",
        "propliopithecus":"Propliopithecus is an extinct genus of ape. The 40 cm (1 ft 4 in) long creature resembled today's gibbons. Its eyes faced forwards, giving it stereoscopical vision. Propliopithecus was most likely an omnivore. The fossil record of higher primates in the Old World begins in the Oligocene of Egypt and extend through the Miocene, Pliocene, and Pleistocene of East Africa, Europe, and Asia. If these fossils represent the appearance of small anthropoid apes, they also provide the evident the touring the Miocene they have given rise to a great variety of different types which must have spread far and did over the Old World. And those that reach the Far East in Pliocene probably gave rise to gibbon and orangutan.",
        "pterosaur":"Pterosaurs are extinct flying reptiles. Pterosaurs are not dinosaurs (or birds for that matter), but close relatives of them. They lived worldwide in all kinds of environments and ranged from around 50 cm to 13 m in wingspan. They existed from about 225 to 65 million years ago and thus ran alongside the dinosaurs pretty much toe to toe for their entire existence, dying out in the great extinction at the end of the Cretaceous period. Although they first appeared in the Triassic period, their origins might extend beyond that by some margin, but fossils of this time are rare, so it is hard to say. \n Ranging from the size of a sparrow to the size of an airplane, the pterosaurs (Greek for 'wing lizards') ruled the skies in the Jurassic and Cretaceous, and included the largest vertebrate ever known to fly: the late Cretaceous Quetzalcoatlus. The appearance of flight in pterosaurs was separate from the evolution of flight in birds and bats; pterosaurs are not closely related to either birds or bats, and thus provide a classic example of convergent evolution. It is now thought that all but the largest pterosaurs could sustain powered flight (i.e. actively gain height when they wanted to on their own power and take off from the ground). They had a large wing membrane stretched from an elongate finger on their hand that connected to their body. Accessory membranes were present in the crux of the arm and between the legs. ",
        "purgatorius":"The earliest primate found in the fossil record is Purgatorius. It was roughly the size of a rat and fed on insects and soft fruits. These early primates may have shared a common ancestor with rodents. During the Paleocene most primate-like animals belonged to a group called Plesiadapiformes. Traditionally, the plesiadapiforms have been regarded as archaic members of the order Primates. Although plesiadapiforms are similar to modern primates in a number of characteristics of their skeleton, they were still on a much lower evolutionary level, comparable perhaps to the living tree-shrews. Modern primates are unique among mammals in their adaptation to life in the trees. Their capabilities of grasping and leaping allow rapid locomotion in this environment, which is in turn related to the large brain size they have developed. As far as we know, plesiadapiforms also spent most of their time in the trees. However, they lack adaptations for fast leaping as we see them in modern primates and were not capable of moving as quickly through the trees. In addition, their brain was still very small in comparison to modern primates. On the other hand, plesiadapiforms soon acquired traits that are unusual for later primates, especially enlarged incisors that are superficially similar to those of rodents. This suggests that the plesiadapiforms were not the direct ancestors of modern primates, but rather a branch that split off from the mainline of primate evolution (from today's point of view) at an early date.",
        "rhinocerotoid":"Rhinocerotoids diverged from other perissodactyls by the early Eocene. Fossils of Hyrachyus eximus found in North America date to this period. This small hornless ancestor resembled a tapir or small horse more than a rhino. Three families, sometimes grouped together as the superfamily Rhinocerotoidea, evolved in the late Eocene: Hyracodontidae, Amynodontidae and Rhinocerotidae.",
        "ribbonwood_tree":"The ribbonwood tree (Idiospermum australiense) is very different from modern plants. All modern flowering plants produce seeds which have either one seed leaf (monocots) or two seed leaves (dicots) but the seeds of the Idiospermum can have between 2 to 6 seed leaves! Normally seeds will germinate and send up a single shoot but the Ribbonwood can sprout more than one shoot per seed.",
        "styporaphidia":"Styporaphidia is an extinct monotypic genus of Snakefly containing the single species Styporaphidia magia. The genus was named from the Greek stypos meaning 'stem' or 'stump' and Raphidia, the type genus for, and most often used as, a stem for generic names in the order Raphidioptera. The species name is from the Greek word mageia meaning 'magic'.",
        "thecodont":"The Thecodonts were a diverse group of Triassic reptiles that included small, agile two- and four-legged forms, large four-legged carnivores, armored herbivores, and crocodile-like aquatic reptiles. They gave rise to crocodiles, dinosaurs, and probably flying reptiles (pterosaurs). \n The Thecodontia are defined by certain shared primitive or ancestral features, such as the suborbital fenestra (an opening on each side of the skull between the eye sockets and the nostrils) and teeth in sockets. The name Thecodont is actually Latin for 'socket-tooth,' referring to the fact that thecodont teeth were set in sockets in the jawbones; an archosaurian characteristic that was inherited by the dinosaurs. \n Thecodontia therefore is an evolutionary grade of animals, rather than a clade. They represent a 'grab-bag' taxon for any archosaur that wasn't a crocodilian, a pterosaur, or a dinosaur. Most palaeontologists nowadays use the term 'basal archosaur' to refer to Thecodonts. \n The Thecodontia are generally divided into four suborders, the Proterosuchia, Phytosauria, the Aetosauria, and the Pseudosuchia. However the Pseudosuchia constitute an artificial group, having the same 'grab-bag' status within the Thecodontia as the Thecodontia have within the Archosauria.",
        "theropod":"The theropod (meaning 'beast-footed') dinosaurs are a diverse group of bipedal saurischian dinosaurs. They include the largest terrestrial carnivores ever to have made the earth tremble. What most people think of as theropods (e.g., T. rex, Deinonychus) are extinct today, but recent studies have conclusively shown that birds are actually the descendants of small nonflying theropods.",
        "viverridae":"Traditionally the Viverravidae (viverravids) had been thought to be the earliest carnivorans with fossil records first appearing in the Paleocene of North America about 60 million years ago. Viverrids are amongst the primitive families of the Carnivora, with skeletons very similar to those of fossils dating back to the Eocene, up to 50 million years ago. They are variable in form, but generally resemble long-nosed cats. Most have retractile or partially-retractile claws, a baculum, and an anal scent gland. Viverrids range in size from the African Linsang with a body length of 33 cm (13 in), and a weight of 650 g (1.4 lb), to the African Civet at 84 cm (33 in) and 18 kg (40 lb), although very large Binturongs, to 25 kg (55 lb), attain the greatest mass. They are nocturnal animals, with excellent hearing and vision. They are generally solitary. Despite their placement in the order Carnivora, they are omnivorous, or, in the case of the Palm Civets, almost entirely herbivorous.",
        "williamsonia":"The first Australian angiosperm-like plant recorded is Williamsonia, which had cones with a bulbous receptacle, surrounded by bracts forming the 'flower'. Williamsonia was a bennettitalean species; meaning that it belonged to the group of Bennettales which were like cycads.",
        "yangchuanosaurus":"Yangchuanosaurus was a theropod dinosaur that lived in China during the late Oxfordian (and possibly Kimmeridgian) stage of the Late Jurassic, and was similar in size and appearance to its North American contemporary, Allosaurus. It hails from the Upper Shaximiao Formation and was the largest predator in a landscape which included the sauropods Mamenchisaurus and Omeisaurus as well as the Stegosaurs Chialingosaurus, Tuojiangosaurus and Chungkingosaurus.",
        "yanornis":"Yanornis is an extinct genus of omnivorous Early Cretaceous birds, thought to be closely related to the common ancestor of all modern birds. The genus name Yanornis is derived from the Ancient Chinese Yan dynasties, whose capital was at Chaoyang, and Ancient Greek ornis, 'bird'. The species Y. martini was named for avian paleontologist Larry Martin. \n It was the size of a chicken, had a long skull with about 10 teeth in the upper jaw and 20 teeth in the lower jaw, and was both able to fly and walk well, having a well-developed U-shaped furcula (wishbone). It ate a varied diet and was capable of switching between major food sources, including fish and seeds, as evidenced by some specimens which preserve large amounts of gastroliths in the stomach. Its fish-eating and associated adaptations shows convergent evolution to the unrelated enantiornithine Longipteryx."
    },

    ancestors: {
        "200_mya": {
            //plants
            "fig_tree":["lycophyte","cycad","ginkgophyta","none"],
            "forest_durian":["lycophyte","cycad","ginkgophyta","none"],
            "ginger":["lycophyte","cycad","ginkgophyta","none"],
            "jambu_tree":["lycophyte","cycad","ginkgophyta","none"],
            "meggaris_tree":["lycophyte","cycad","ginkgophyta","none"],
            "pitcher_plant":["lycophyte","cycad","ginkgophyta","none"],
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
            "helmeted_hornbill":["hadrocodium","theropod","thecodont","none"],
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
            "pitcher_plant":["araucariaceae","cycad","pinaceae","none"],
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
            "helmeted_hornbill":["archaeopteryx","crusafonta","yangchuanosaurus","none"],
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
            "pitcher_plant":["williamsonia","ribbonwood_tree","cycadeoidea_marylandica","none"],
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
            "helmeted_hornbill":["enantiornithes","yanornis","pterosaur","none"],
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
            "pitcher_plant":["lycophyte","pinaceae","cycadeoidea_marylandica","none"],
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
            "helmeted_hornbill":["passeriform","bucerotidae","phasianidae","none"],
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
            "pitcher_plant":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
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
            "blue_headed_pitta":["passeriform","bucerotidae","phasianidae","none"],
            "garnet_pitta":["passeriform","bucerotidae","phasianidae","none"],
            "helmeted_hornbill":["passeriform","bucerotidae","phasianidae","none"],
            "malabar_grey_hornbill":["passeriform","bucerotidae","phasianidae","none"],
            "great_argus_pheasant":["passeriform","bucerotidae","phasianidae","none"],
            "rhinoceros_hornbill":["passeriform","bucerotidae","phasianidae","none"],
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
            "pitcher_plant":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
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
            "blue_headed_pitta":["passeriform","bucerotidae","phasianidae","none"],
            "garnet_pitta":["passeriform","bucerotidae","phasianidae","none"],
            "helmeted_hornbill":["passeriform","bucerotidae","phasianidae","none"],
            "malabar_grey_hornbill":["passeriform","bucerotidae","phasianidae","none"],
            "great_argus_pheasant":["passeriform","bucerotidae","phasianidae","none"],
            "rhinoceros_hornbill":["passeriform","bucerotidae","phasianidae","none"],
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
            "pitcher_plant":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
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
            "blue_headed_pitta":["passeriform","bucerotidae","phasianidae","none"],
            "garnet_pitta":["passeriform","bucerotidae","phasianidae","none"],
            "helmeted_hornbill":["passeriform","bucerotidae","phasianidae","none"],
            "malabar_grey_hornbill":["passeriform","bucerotidae","phasianidae","none"],
            "great_argus_pheasant":["passeriform","bucerotidae","phasianidae","none"],
            "rhinoceros_hornbill":["passeriform","bucerotidae","phasianidae","none"],
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
            "pitcher_plant":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "rafflesia":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "tetrastigma":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            "titan_arum":["cycadeoidea_marylandica","ginkgophyta","williamsonia","none"],
            //insects
            "ant":["mesokristensenia","styporaphidia","empididae","none"],
            "fig_wasp":["mesokristensenia","styporaphidia","empididae","none"],
            "termite":["mesokristensenia","styporaphidia","empididae","none"],
            //primates
            "bornean_orangutan":["common_gibbon","oranutan","presbytis","none"],
            "mitered_leaf_monkey":["common_gibbon","oranutan","presbytis","none"],
            "muellers_gibbon":["common_gibbon","oranutan","presbytis","none"],
            "proboscis_monkey":["common_gibbon","oranutan","presbytis","none"],
            "sumatran_orangutan":["common_gibbon","oranutan","presbytis","none"],
            "white_fronted_langur":["common_gibbon","oranutan","presbytis","none"],
            //birds
            "blue_headed_pitta":["passeriform","bucerotidae","phasianidae","none"],
            "garnet_pitta":["passeriform","bucerotidae","phasianidae","none"],
            "helmeted_hornbill":["passeriform","bucerotidae","phasianidae","none"],
            "malabar_grey_hornbill":["passeriform","bucerotidae","phasianidae","none"],
            "great_argus_pheasant":["passeriform","bucerotidae","phasianidae","none"],
            "rhinoceros_hornbill":["passeriform","bucerotidae","phasianidae","none"],
            //other mammals 1
            "civet":["viverridae","panthera","clouded_leopard","none"],
            "sunda_clouded_leopard":["viverridae","panthera","clouded_leopard","none"],
            "leopard_cat":["viverridae","panthera","clouded_leopard","none"],
            "sumatran_tiger":["viverridae","panthera","clouded_leopard","none"],
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
        "PaulChoi":{"1":"The pheasant differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The pheasant differentiated at 10 mya. What did you see happen in the previous time period (i.e., 25 mya) with other species or the environment that could explain this differentiation?"},
        "MarissaAycan":{"1":"The pittas differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The pittas differentiated at 5 mya. What did you see happen in the previous time period (i.e., 10 mya) with other species or the environment that could explain this differentiation?"},
        "YaelBoyd":{"1":"Fig wasps differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"Did plants differentiate very much between 25 mya and 2 mya? Could this have effects on the evolutionary processes of the other species? Briefly explain your answer."},
        "MengtingQiu":{"1":"Many mammals differentiated at 100 mya. What did you see happen in the previous time period (i.e., 50 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The tapir differentiated at 5 mya. What did you see happen in the previous time period (i.e., 10 mya) with other species or the environment that could explain this differentiation?"},
        "EthanWissell":{"1":"The porcupines differentiated at 100 mya. What did you see happen in the previous time period (i.e., 150 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The cats differentiated at 2 mya. What did you see happen in the previous time period (i.e., 5 mya) with other species or the environment that could explain this differentiation?"},
        "RachelAllen":{"1":"Primates differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the  other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"When did the apes differentiate from old world monkeys? What did you see happen in the previous time period with other species or the environment that could explain this differentiation?"},
        "BenjaminBarrett":{"1":"The hornbills differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The hornbills differentiated at 2 mya. What did you see happen in the previous time period (i.e., 5 mya) with other species or the environment that could explain this differentiation?"},
        "AndrewChi":{"1":"Fig wasps differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"Did insects differentiate very much between 25 mya and 2 mya? Could this have an effect on the evolutionary processes of the other species? Briefly explain your answer."},
        "BrianHyung":{"1":"Many plants differentiated at 100 mya. What did you see happen in the previous time period (i.e., 50 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"Did plants differentiate very much between 25 mya and 2 mya? Could this have effects on the evolutionary processes of the other species? Briefly explain your answer."},
        "AjayShah":{"1":"The porcupines differentiated at 100 mya. What did you see happen in the previous time period (i.e., 150 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The cats differentiated at 2 mya. What did you see happen in the previous time period (i.e., 5 mya) with other species or the environment that could explain this differentiation?"},
        "OrianeEdwards":{"1":"Primates differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the  other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"When did the apes differentiate from old world monkeys? What did you see happen in the previous time period with other species or the environment that could explain this differentiation?"},
        "AruthyPathmarajan":{"1":"The primates shared a common ancestor with other mammals. Describe this ancestor organism and the conditions that allowed it to evolve. Remember to identify the time periods involved.  ","2":"The gibbon differentiated at 5 mya. What did you see happen in the previous time period (i.e., 10 mya) with other species or the environment that could explain this differentiation?"},
        "GeorgeCheng":{"1":"The hornbills differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The hornbills differentiated at 2 mya. What did you see happen in the previous time period (i.e., 5 mya) with other species or the environment that could explain this differentiation?"},
        "RaymondYu":{"1":"Fig wasps differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"Did insects differentiate very much between 25 mya and 2 mya? Could this have an effect on the evolutionary processes of the other species? Briefly explain your answer."},
        "ArkadyArkhangorodsky":{"1":"Many plants differentiated at 100 mya. What did you see happen in the previous time period (i.e., 50 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"Did plants differentiate very much between 25 mya and 2 mya? Could this have effects on the evolutionary processes of the other species? Briefly explain your answer."},
        "IlyaKreynin":{"1":"Many mammals differentiated at 100 mya. What did you see happen in the previous time period (i.e., 50 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The cats differentiated at 2 mya. What did you see happen in the previous time period (i.e., 5 mya) with other species or the environment that could explain this differentiation?"},
        "AnnaJiang":{"1":"The porcupines differentiated at 100 mya. What did you see happen in the previous time period (i.e., 150 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The tapir differentiated at 5 mya. What did you see happen in the previous time period (i.e., 10 mya) with other species or the environment that could explain this differentiation?"},
        "CordeliaCho":{"1":"Primates differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the  other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"When did the apes differentiate from old world monkeys? What did you see happen in the previous time period with other species or the environment that could explain this differentiation?"},
        "ChristinaJewell":{"1":"The pittas differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The pheasant differentiated at 10 mya. What did you see happen in the previous time period (i.e., 25 mya) with other species or the environment that could explain this differentiation?"},
        "AdamWaitzer":{"1":"The pheasant differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The pittas differentiated at 5 mya. What did you see happen in the previous time period (i.e., 10 mya) with other species or the environment that could explain this differentiation?"},
        "SamaaKazerouni":{"1":"Many plants differentiated at 100 mya. What did you see happen in the previous time period (i.e., 50 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"Did insects differentiate very much between 25 mya and 2 mya? Could this have an effect on the evolutionary processes of the other species? Briefly explain your answer."},
        "JosephKatesRose":{"1":"Many mammals differentiated at 100 mya. What did you see happen in the previous time period (i.e., 50 mya) with the other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"The cats differentiated at 2 mya. What did you see happen in the previous time period (i.e., 5 mya) with other species or the environment that could explain this differentiation?"},
        "JasmineLee":{"1":"Primates differentiated at 50 mya. What did you see happen in the previous time period (i.e., 100 mya) with the  other species or the environment that could explain this differentiation? Please identify the relevant species and time periods in your answer.","2":"When did the apes differentiate from old world monkeys? What did you see happen in the previous time period with other species or the environment that could explain this differentiation?"},
        "CarolNg":{"1":"The primates shared a common ancestor with other mammals. Describe this ancestor organism and the conditions that allowed it to evolve. Remember to identify the time periods involved.","2":"The gibbon differentiated at 5 mya. What did you see happen in the previous time period (i.e., 10 mya) with other species or the environment that could explain this differentiation?"}
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
                EvoRoom.assignedLocation = Sail.app.user_metadata.currently_assigned_location;
                EvoRoom.currentLocation = Sail.app.user_metadata.current_location;
                
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

        // register on-click listeners for room QR code scanning error resolution               // ARMIN, I've added the day 2 thing here, it's different than the others... but I think it's right
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
            $('#student-chosen-organisms').hide();
            
            Sail.app.submitOrganismObservationsDone();
            EvoRoom.buttonRevealCounter = 0;
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

        $('#concepts-discussion .time-period-pop-up-button').click(function() {
            $('#time-period-pop-up').show();
        });
        
        $('#concepts-discussion .organism-pop-up-button').click(function() {
            $('#organism-pop-up').show();
        });

        $('#time-period-pop-up .small-button').click(function() {
            $('#time-period-pop-up').hide();
        });
        
        $('#organism-pop-up .small-button').click(function() {
            $('#organism-pop-up').hide();
        });

        $('#concepts-discussion .small-button').click(function() {
            EvoRoom.submitConceptDiscussion();
            alert('Your data has been submitted');

            Sail.app.hidePageElements();
            // clear fields, reload the page
            $('#concepts-discussion .evolution-concept-dropdown').val('');
            $('#concepts-discussion .concepts-discussion-text-entry').val('');
            
            $('#time-period-pop-up .time-period-form :checkbox:checked').prop('checked', false);
            $('#organism-pop-up .organism-form').prop('checked', false);

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

                if (sev.payload.to === 'OBSERVING_PAST') {
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
    
    submitOrganismObservationsDone: function() {
        var sev = new Sail.Event('organism_observations_done', {
            // empty payload
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
            // empty payload
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
            time:$('#time-period-pop-up .time-period-form :checkbox:checked').map(function(){return $(this).val();}).toArray(),
            organism:$('#organism-pop-up .organism-form :checkbox:checked').map(function(){return $(this).val();}).toArray(),
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
        // organisms
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
        // ancestors    
        } else if (organismString === "anisopodidae") {
            return "Anisopodidae";
        } else if (organismString === "araucariaceae") {
            return "Araucariaceae";
        } else if (organismString === "archaeopteryx") {
            return "Archaeopteryx";
        } else if (organismString === "asiavorator") {
            return "Asiavorator";
        } else if (organismString === "bucerotidae") {
            return "Bucerotidae";
        } else if (organismString === "chrysomeloidea") {
            return "Chrysomeloidea";
        } else if (organismString === "cicadellidae") {
            return "Cicadellidae";
        } else if (organismString === "clouded_leopard") {
            return "Clouded leopard";
        } else if (organismString === "colobinae") {
            return "Colobinae";
        } else if (organismString === "common_gibbon") {
            return "Common gibbon";
        } else if (organismString === "common_pangolin") {
            return "Common pangolin";
        } else if (organismString === "crusafonta") {
            return "Crusafonta";
        } else if (organismString === "cupedidae") {
            return "Cupedidae";
        } else if (organismString === "cycadeoidea_marylandica") {
            return "Cycadeoidea marylandica ";
        } else if (organismString === "cycad") {
            return "Cycads";
        } else if (organismString === "dryopithecus") {
            return "Dryopithecus";
        } else if (organismString === "early_sphecoid_wasp") {
            return "Early sphecoid wasp";
        } else if (organismString === "empididae") {
            return "Empididae";
        } else if (organismString === "enantiornithe") {
            return "Enantiornithe";
        } else if (organismString === "eomaia") {
            return "Eomaia";
        } else if (organismString === "eomanis") {
            return "Eomanis";
        } else if (organismString === "felidae") {
            return "Felidae";
        } else if (organismString === "first_tapir") {
            return "First tapir";
        } else if (organismString === "ginkgophyta") {
            return "Ginkgophyta";
        } else if (organismString === "gomphos_elkema") {
            return "Gomphos elkema";
        } else if (organismString === "hadrocodium") {
            return "Hadrocodium";
        } else if (organismString === "heptodon") {
            return "Heptodon";
        } else if (organismString === "lycophyte") {
            return "Lycophyte";
        } else if (organismString === "mastotermitidae") {
            return "Mastotermitidae";
        } else if (organismString === "mesokristensenia") {
            return "Mesokristensenia";
        } else if (organismString === "miacid") {
            return "Miacids";
        } else if (organismString === "multituberculata") {
            return "Multituberculata";
        } else if (organismString === "new_world_monkey") {
            return "New world monkey";
        } else if (organismString === "old_world_monkey") {
            return "Old world monkey";
        } else if (organismString === "old_world_porcupine") {
            return "Old world porcupine";
        } else if (organismString === "oligocene_rodent") {
            return "Oligocene rodent";
        } else if (organismString === "oranutan") {
            return "Oranutan";
        } else if (organismString === "palaeolagus") {
            return "Palaeolagus";
        } else if (organismString === "panthera") {
            return "Panthera";
        } else if (organismString === "passeriform") {
            return "Passeriform";
        } else if (organismString === "perissodactyl") {
            return "Perissodactyl";
        } else if (organismString === "phasianidae") {
            return "Phasianidae";
        } else if (organismString === "pinaceae") {
            return "Pinaceae";
        } else if (organismString === "presbytis") {
            return "Presbytis";
        } else if (organismString === "propliopithecus") {
            return "Propliopithecus";
        } else if (organismString === "pterosaur") {
            return "Pterosaur";
        } else if (organismString === "purgatorius") {
            return "Purgatorius";
        } else if (organismString === "rhinocerotoid") {
            return "Rhinocerotoids";
        } else if (organismString === "ribbonwood_tree") {
            return "Ribbonwood tree";
        } else if (organismString === "styporaphidia") {
            return "Styporaphidia";
        } else if (organismString === "thecodont") {
            return "Thecodont";
        } else if (organismString === "theropod") {
            return "Theropod";
        } else if (organismString === "viverridae") {
            return "Viverridae";
        } else if (organismString === "williamsonia") {
            return "Williamsonia";
        } else if (organismString === "yangchuanosaurus") {
            return "Yangchuanosaurus";
        } else if (organismString === "yanornis") {
            return "Yanornis";
        // none
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
                    $('#ancestor-information-details .ancestor-description').text(Sail.app.ancestorsText[ancestorChosenString]);
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
