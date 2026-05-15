/* ============================================================
   qualiopi-indicateurs.js
   Outil Qualiopi 32 indicateurs — LesFormateurs.online
   Vanilla JS — aucune dependance externe
   ============================================================ */

(function () {
  "use strict";

  // ── DATA ──────────────────────────────────────────────────

  var QUALIOPI_INDICATEURS = [
    // CRITERE 1
    {id:1,c:1,cL:"Information du public",titre:"Information accessible au public",
     niveau:"Diffuser une information accessible, detaillee et verifiable : prerequis, objectifs, duree, modalites et delais d'acces, tarifs, contacts, methodes, accessibilite handicap.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     neInfo:"Le nouveau prestataire presente les informations relatives a ses futures prestations.",
     docs:[
       {label:"Site internet \u00e0 jour (programme, tarifs, pr\u00e9requis, modalit\u00e9s, d\u00e9lais d\u2019acc\u00e8s)",req:true},
       {label:"Catalogue / plaquette de formation",req:true},
       {label:"Conditions g\u00e9n\u00e9rales de vente (CGV)",req:true},
       {label:"Fiches programmes d\u00e9taill\u00e9es (objectifs, dur\u00e9e, contenu, \u00e9valuation)",req:true},
       {label:"Mention accessibilit\u00e9 handicap + contact r\u00e9f\u00e9rent handicap",req:true},
       {label:"Livret d\u2019accueil apprenant",req:false},
       {label:"Contrat ou convention de formation type",req:false}
     ]},
    {id:2,c:1,cL:"Information du public",titre:"Indicateurs de r\u00e9sultats",
     niveau:"Diffuser des indicateurs de r\u00e9sultats adapt\u00e9s \u00e0 la nature des prestations et des publics accueillis.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     neInfo:"Pas d\u2019obligation de r\u00e9sultats car pas d\u2019historique. Pr\u00e9voir la m\u00e9thodologie de collecte.",
     docs:[
       {label:"Tableau des indicateurs de r\u00e9sultats (satisfaction, r\u00e9ussite, abandon, insertion)",req:true},
       {label:"Preuve de diffusion publique (capture site, affichage, documents)",req:true},
       {label:"Enqu\u00eates de satisfaction compil\u00e9es",req:false},
       {label:"M\u00e9thodologie de collecte des indicateurs",req:false}
     ]},
    {id:3,c:1,cL:"Information du public",titre:"Taux d\u2019obtention des certifications",
     niveau:"Informer sur les taux d\u2019obtention, blocs de comp\u00e9tences, \u00e9quivalences, passerelles, suites de parcours et d\u00e9bouch\u00e9s.",
     applies:{OF:false,CBC:false,VAE:true,CFA:true,certifiante:true},
     docs:[
       {label:"Fiche RS/RNCP avec taux de r\u00e9ussite \u00e0 jour",req:true},
       {label:"Document \u00e9quivalences, passerelles et suites de parcours",req:true},
       {label:"Information sur les d\u00e9bouch\u00e9s professionnels",req:true},
       {label:"Possibilit\u00e9s de validation partielle (blocs de comp\u00e9tences)",req:true}
     ]},
    // CRITERE 2
    {id:4,c:2,cL:"Objectifs et adaptation",titre:"Analyse du besoin du b\u00e9n\u00e9ficiaire",
     niveau:"Analyser le besoin du b\u00e9n\u00e9ficiaire en lien avec l\u2019entreprise et/ou le financeur concern\u00e9.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Questionnaire de recueil des besoins / positionnement",req:true},
       {label:"Compte-rendu d\u2019entretien pr\u00e9alable",req:false},
       {label:"Convention ou contrat de formation sign\u00e9",req:true},
       {label:"Fiche d\u2019analyse des besoins par b\u00e9n\u00e9ficiaire",req:true},
       {label:"Preuve de prise en compte du handicap (si applicable)",req:false}
     ]},
    {id:5,c:2,cL:"Objectifs et adaptation",titre:"Objectifs de la prestation",
     niveau:"D\u00e9finir les objectifs op\u00e9rationnels et \u00e9valuables de la prestation.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Programme avec objectifs p\u00e9dagogiques op\u00e9rationnels",req:true},
       {label:"R\u00e9f\u00e9rentiel de comp\u00e9tences vis\u00e9es",req:true},
       {label:"Grille d\u2019\u00e9valuation align\u00e9e sur les objectifs",req:true},
       {label:"Fiche et programme de travail (CBC/VAE)",req:false}
     ]},
    {id:6,c:2,cL:"Objectifs et adaptation",titre:"Contenus et modalit\u00e9s de mise en \u0153uvre",
     niveau:"\u00c9tablir les contenus et modalit\u00e9s adapt\u00e9s aux objectifs et aux publics b\u00e9n\u00e9ficiaires.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"D\u00e9roul\u00e9 p\u00e9dagogique d\u00e9taill\u00e9 (s\u00e9quences, dur\u00e9es, m\u00e9thodes)",req:true},
       {label:"Supports de formation",req:false},
       {label:"Planning / calendrier de la formation",req:true},
       {label:"Modalit\u00e9s p\u00e9dagogiques (pr\u00e9sentiel, distanciel, mixte, AFEST)",req:true},
       {label:"Outils et moyens techniques utilis\u00e9s",req:false}
     ]},
    {id:7,c:2,cL:"Objectifs et adaptation",titre:"Ad\u00e9quation contenu / certification vis\u00e9e",
     niveau:"S\u2019assurer de l\u2019ad\u00e9quation du contenu aux exigences de la certification vis\u00e9e.",
     applies:{OF:false,CBC:false,VAE:true,CFA:true,certifiante:true},
     docs:[
       {label:"Tableau de correspondance programme / r\u00e9f\u00e9rentiel certification",req:true},
       {label:"R\u00e9f\u00e9rentiel de la certification (RS/RNCP)",req:true},
       {label:"Cahier des charges de la certification professionnelle",req:false},
       {label:"Outils de suivi de conformit\u00e9 au r\u00e9f\u00e9rentiel",req:false}
     ]},
    {id:8,c:2,cL:"Objectifs et adaptation",titre:"Positionnement \u00e0 l\u2019entr\u00e9e",
     niveau:"D\u00e9terminer les proc\u00e9dures de positionnement et d\u2019\u00e9valuation des acquis \u00e0 l\u2019entr\u00e9e.",
     applies:{OF:false,CBC:false,VAE:false,CFA:true,certifiante:true},
     docs:[
       {label:"Tests de positionnement (QCM, entretien, mise en situation)",req:true},
       {label:"Grille d\u2019\u00e9valuation initiale des acquis",req:true},
       {label:"R\u00e9sultats du positionnement par b\u00e9n\u00e9ficiaire",req:true},
       {label:"Proc\u00e9dure d\u2019adaptation du parcours suite au positionnement",req:true}
     ]},
    // CRITERE 3
    {id:9,c:3,cL:"Accompagnement",titre:"Conditions de d\u00e9roulement",
     niveau:"Informer les b\u00e9n\u00e9ficiaires sur les conditions de d\u00e9roulement et les modalit\u00e9s d\u2019\u00e9valuation.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"R\u00e8glement int\u00e9rieur (obligatoire)",req:true},
       {label:"Convocation / confirmation avec infos pratiques",req:true},
       {label:"Livret d\u2019accueil (horaires, lieu, contacts, programme, r\u00e8gles)",req:true},
       {label:"Extranet / espace apprenant en ligne (si distanciel)",req:false},
       {label:"Modalit\u00e9s d\u2019\u00e9valuation communiqu\u00e9es au b\u00e9n\u00e9ficiaire",req:true}
     ]},
    {id:10,c:3,cL:"Accompagnement",titre:"Adaptation et suivi de la prestation",
     niveau:"Mettre en \u0153uvre et adapter la prestation, l\u2019accompagnement et le suivi.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Feuilles d\u2019\u00e9margement sign\u00e9es ou preuves de connexion",req:true},
       {label:"\u00c9valuations interm\u00e9diaires / bilans de progression",req:true},
       {label:"Comptes-rendus d\u2019entretiens individuels de suivi",req:false},
       {label:"Preuve d\u2019adaptation du parcours en cours",req:false},
       {label:"Relev\u00e9 d\u2019activit\u00e9 du formateur",req:false}
     ]},
    {id:11,c:3,cL:"Accompagnement",titre:"\u00c9valuation de l\u2019atteinte des objectifs",
     niveau:"\u00c9valuer l\u2019atteinte des objectifs par les b\u00e9n\u00e9ficiaires en cours et \u00e0 la fin de la prestation.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     neInfo:"Le nouveau prestataire peut pr\u00e9senter les modalit\u00e9s d\u2019\u00e9valuation pr\u00e9vues.",
     docs:[
       {label:"\u00c9valuation de fin de formation (QCM, mise en situation, soutenance)",req:true},
       {label:"Attestation de fin de formation (obligatoire art. L.6353-1)",req:true},
       {label:"Certificat de r\u00e9alisation (obligatoire pour financeurs)",req:true},
       {label:"R\u00e9sultats individuels d\u2019\u00e9valuation",req:true},
       {label:"PV de jury (si certification)",req:false},
       {label:"Document de synth\u00e8se CBC / Livret 2 VAE (si applicable)",req:false}
     ]},
    {id:12,c:3,cL:"Accompagnement",titre:"Engagement et pr\u00e9vention des ruptures",
     niveau:"D\u00e9crire et mettre en \u0153uvre les mesures pour favoriser l\u2019engagement et pr\u00e9venir les ruptures de parcours.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Proc\u00e9dure de suivi des absences et abandons",req:true},
       {label:"Dispositif de relance / accompagnement en cas de difficult\u00e9",req:true},
       {label:"Entretiens de remobilisation (preuves)",req:false},
       {label:"Taux d\u2019abandon et analyse des causes",req:false}
     ]},
    {id:13,c:3,cL:"Accompagnement",titre:"Coordination apprentissages en situation de travail",
     niveau:"Coordonner les acteurs pour assurer la coh\u00e9rence des apprentissages en alternance / AFEST.",
     applies:{OF:false,CBC:false,VAE:false,CFA:true,alternance:true},
     docs:[
       {label:"Livret de suivi en entreprise / carnet de liaison",req:true},
       {label:"Convention de stage ou contrat d\u2019alternance",req:true},
       {label:"Fiche de liaison tuteur-entreprise / formateur-CFA",req:true},
       {label:"Comptes-rendus de visites en entreprise",req:true},
       {label:"Planning d\u2019alternance CFA / entreprise",req:true},
       {label:"Grille d\u2019\u00e9valuation des comp\u00e9tences en entreprise",req:true}
     ]},
    {id:14,c:3,cL:"Accompagnement",titre:"Accompagnement socio-professionnel et citoyennet\u00e9",
     niveau:"CFA : mettre en \u0153uvre un accompagnement socio-professionnel, \u00e9ducatif et relatif \u00e0 la citoyennet\u00e9.",
     applies:{OF:false,CBC:false,VAE:false,CFA:true},
     docs:[
       {label:"Programme d\u2019actions sociales, \u00e9ducatives et citoyennes",req:true},
       {label:"Planning des activit\u00e9s hors formation",req:true},
       {label:"D\u00e9signation d\u2019un r\u00e9f\u00e9rent socio-\u00e9ducatif",req:true},
       {label:"Preuves de mise en \u0153uvre (photos, CR, attestations)",req:false}
     ]},
    {id:15,c:3,cL:"Accompagnement",titre:"Droits et devoirs de l\u2019apprenti",
     niveau:"CFA : informer les apprentis sur leurs droits et devoirs, r\u00e8gles de sant\u00e9 et s\u00e9curit\u00e9.",
     applies:{OF:false,CBC:false,VAE:false,CFA:true},
     docs:[
       {label:"R\u00e8glement int\u00e9rieur sp\u00e9cifique CFA",req:true},
       {label:"Document des droits et devoirs de l\u2019apprenti",req:true},
       {label:"Document sant\u00e9 et s\u00e9curit\u00e9 au travail",req:true},
       {label:"Attestation de prise de connaissance sign\u00e9e par l\u2019apprenti",req:true}
     ]},
    {id:16,c:3,cL:"Accompagnement",titre:"Pr\u00e9sentation aux certifications",
     niveau:"S\u2019assurer que les conditions de pr\u00e9sentation respectent les exigences de la certification vis\u00e9e.",
     applies:{OF:false,CBC:false,VAE:true,CFA:true,certifiante:true},
     docs:[
       {label:"Calendrier des sessions d\u2019examen / certification",req:true},
       {label:"Convocation du b\u00e9n\u00e9ficiaire aux \u00e9preuves",req:true},
       {label:"Modalit\u00e9s de passage d\u00e9taill\u00e9es",req:true},
       {label:"Convention avec l\u2019organisme certificateur",req:false},
       {label:"PV de jury / r\u00e9sultats de certification",req:true}
     ]},
    // CRITERE 4
    {id:17,c:4,cL:"Moyens p\u00e9dagogiques",titre:"Moyens humains et techniques adapt\u00e9s",
     niveau:"Mettre \u00e0 disposition des moyens humains et techniques adapt\u00e9s et d\u2019un environnement appropri\u00e9.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Liste des moyens mat\u00e9riels et techniques",req:true},
       {label:"CV des formateurs / intervenants \u00e0 jour",req:true},
       {label:"Organigramme de l\u2019\u00e9quipe p\u00e9dagogique et administrative",req:true},
       {label:"Preuve d\u2019accessibilit\u00e9 des locaux (ERP, registre)",req:true},
       {label:"Attestation d\u2019assurance professionnelle",req:false},
       {label:"Descriptif plateforme LMS / e-learning (si distanciel)",req:false}
     ]},
    {id:18,c:4,cL:"Moyens p\u00e9dagogiques",titre:"Coordination des intervenants",
     niveau:"Mobiliser et coordonner les intervenants internes et/ou externes.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Planning d\u2019intervention des formateurs",req:true},
       {label:"Comptes-rendus de r\u00e9unions p\u00e9dagogiques",req:true},
       {label:"Contrats des formateurs / intervenants externes",req:true},
       {label:"Process de briefing / d\u00e9briefing des intervenants",req:false},
       {label:"Outils de communication interne",req:false}
     ]},
    {id:19,c:4,cL:"Moyens p\u00e9dagogiques",titre:"Ressources p\u00e9dagogiques",
     niveau:"Mettre \u00e0 disposition les ressources p\u00e9dagogiques et permettre au b\u00e9n\u00e9ficiaire de se les approprier.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Liste des ressources p\u00e9dagogiques",req:true},
       {label:"Acc\u00e8s plateforme e-learning / ressources en ligne",req:false},
       {label:"Proc\u00e9dure de mise \u00e0 disposition des supports",req:true},
       {label:"Preuve de remise des ressources",req:false}
     ]},
    {id:20,c:4,cL:"Moyens p\u00e9dagogiques",titre:"Personnel d\u00e9di\u00e9 handicap, mobilit\u00e9, mixit\u00e9 (CFA)",
     niveau:"CFA : disposer d\u2019un personnel d\u00e9di\u00e9 \u00e0 la mobilit\u00e9, la mixit\u00e9 et l\u2019accompagnement handicap.",
     applies:{OF:false,CBC:false,VAE:false,CFA:true},
     docs:[
       {label:"Fiche de poste du r\u00e9f\u00e9rent handicap (nominatif)",req:true},
       {label:"Fiche de poste du r\u00e9f\u00e9rent mobilit\u00e9 internationale",req:true},
       {label:"Proc\u00e9dure d\u2019accompagnement des PSH",req:true},
       {label:"Actions de promotion de la mixit\u00e9 des m\u00e9tiers",req:true},
       {label:"Partenariats structures sp\u00e9cialis\u00e9es (Agefiph, Cap emploi, MDPH)",req:false}
     ]},
    // CRITERE 5
    {id:21,c:5,cL:"Qualification des personnels",titre:"Comp\u00e9tences des personnels formateurs",
     niveau:"D\u00e9terminer, mobiliser et \u00e9valuer les comp\u00e9tences des intervenants adapt\u00e9es aux prestations.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"CV actualis\u00e9s de TOUS les formateurs",req:true},
       {label:"Dipl\u00f4mes, titres et certifications des formateurs",req:true},
       {label:"Fiches de poste des intervenants",req:true},
       {label:"Crit\u00e8res de s\u00e9lection / recrutement des formateurs",req:true},
       {label:"Entretiens annuels d\u2019\u00e9valuation des formateurs",req:false},
       {label:"Habilitations sp\u00e9cifiques si r\u00e9glement\u00e9 (SST, CACES, etc.)",req:false}
     ]},
    {id:22,c:5,cL:"Qualification des personnels",titre:"Formation continue des personnels",
     niveau:"Entretenir et d\u00e9velopper les comp\u00e9tences des salari\u00e9s adapt\u00e9es aux prestations.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Plan de d\u00e9veloppement des comp\u00e9tences du personnel",req:true},
       {label:"Attestations / certificats de formations suivies",req:true},
       {label:"Comptes-rendus d\u2019entretiens professionnels",req:false},
       {label:"Veille p\u00e9dagogique, technique et sectorielle (preuves)",req:true},
       {label:"Participation colloques, webinaires, conf\u00e9rences",req:false}
     ]},
    // CRITERE 6
    {id:23,c:6,cL:"Environnement socio-\u00e9conomique",titre:"Veille l\u00e9gale et r\u00e9glementaire",
     niveau:"R\u00e9aliser une veille l\u00e9gale et r\u00e9glementaire sur le champ de la formation professionnelle.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Tableau / outil de veille r\u00e9glementaire \u00e0 jour",req:true},
       {label:"Abonnements sources officielles (L\u00e9gifrance, DREETS, France comp\u00e9tences)",req:true},
       {label:"Preuves de prise en compte des \u00e9volutions (MAJ CGV, programmes, process)",req:true},
       {label:"CR de r\u00e9union suite \u00e0 une \u00e9volution r\u00e9glementaire",req:false}
     ]},
    {id:24,c:6,cL:"Environnement socio-\u00e9conomique",titre:"Veille comp\u00e9tences, m\u00e9tiers et emplois",
     niveau:"R\u00e9aliser une veille sur les \u00e9volutions des comp\u00e9tences, m\u00e9tiers et emplois.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Documents de veille m\u00e9tiers / comp\u00e9tences (ROME, rapports sectoriels)",req:true},
       {label:"Preuves d\u2019adaptation de l\u2019offre suite \u00e0 la veille",req:true},
       {label:"Participation \u00e0 des r\u00e9seaux professionnels",req:false},
       {label:"Rencontres avec des professionnels / entreprises du secteur",req:false}
     ]},
    {id:25,c:6,cL:"Environnement socio-\u00e9conomique",titre:"Veille technologique et p\u00e9dagogique",
     niveau:"R\u00e9aliser une veille sur les innovations p\u00e9dagogiques et technologiques.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Outils de veille p\u00e9dagogique / technologique",req:true},
       {label:"Preuves d\u2019int\u00e9gration de nouvelles m\u00e9thodes ou outils",req:true},
       {label:"Formation des formateurs aux nouvelles technologies",req:false},
       {label:"Benchmark innovations p\u00e9dagogiques (IA, gamification, VR)",req:false}
     ]},
    {id:26,c:6,cL:"Environnement socio-\u00e9conomique",titre:"Handicap \u2014 R\u00e9f\u00e9rent, r\u00e9seau et accessibilit\u00e9",
     niveau:"Mobiliser les expertises, outils et r\u00e9seaux pour accueillir et accompagner les PSH.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"D\u00e9signation nominative du r\u00e9f\u00e9rent handicap",req:true},
       {label:"Registre public d\u2019accessibilit\u00e9 (obligatoire ERP)",req:true},
       {label:"Proc\u00e9dure d\u2019accueil et d\u2019am\u00e9nagement pour les PSH",req:true},
       {label:"Liste des partenaires handicap (Agefiph, Cap emploi, MDPH)",req:true},
       {label:"Formation du r\u00e9f\u00e9rent handicap (attestation)",req:false},
       {label:"Exemples d\u2019am\u00e9nagements r\u00e9alis\u00e9s (preuves)",req:false}
     ]},
    {id:27,c:6,cL:"Environnement socio-\u00e9conomique",titre:"Sous-traitance et portage salarial (V9)",
     niveau:"S\u2019assurer de la conformit\u00e9 au r\u00e9f\u00e9rentiel par le sous-traitant ou salari\u00e9 port\u00e9. V9 : d\u00e9montrer les modalit\u00e9s de s\u00e9lection et pilotage.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Liste compl\u00e8te des sous-traitants / salari\u00e9s port\u00e9s",req:true},
       {label:"Contrats de sous-traitance d\u00e9taill\u00e9s (missions, responsabilit\u00e9s)",req:true},
       {label:"Processus de s\u00e9lection des sous-traitants (crit\u00e8res, grille)",req:true},
       {label:"Justificatifs sous-traitants (Qualiopi si CPF, CV, dipl\u00f4mes)",req:true},
       {label:"Pilotage qualit\u00e9 sous-traitants (\u00e9valuations, r\u00e9unions, audits)",req:true},
       {label:"Charte qualit\u00e9 sign\u00e9e par les sous-traitants",req:false}
     ]},
    {id:28,c:6,cL:"Environnement socio-\u00e9conomique",titre:"Co-construction en situation de travail",
     niveau:"Mobiliser le r\u00e9seau socio-\u00e9conomique pour co-construire l\u2019ing\u00e9nierie et favoriser l\u2019accueil en entreprise.",
     applies:{OF:false,CBC:false,VAE:false,CFA:true,alternance:true},
     docs:[
       {label:"Conventions de partenariat avec entreprises d\u2019accueil",req:true},
       {label:"Processus de co-construction p\u00e9dagogique avec entreprises",req:true},
       {label:"Enqu\u00eate aupr\u00e8s des ma\u00eetres d\u2019apprentissage",req:true},
       {label:"Actions de formation des tuteurs entreprise",req:false}
     ]},
    {id:29,c:6,cL:"Environnement socio-\u00e9conomique",titre:"Insertion professionnelle (CFA)",
     niveau:"CFA : d\u00e9velopper des actions concourant \u00e0 l\u2019insertion ou la poursuite d\u2019\u00e9tudes.",
     applies:{OF:false,CBC:false,VAE:false,CFA:true},
     docs:[
       {label:"Actions d\u2019aide \u00e0 l\u2019insertion (ateliers CV, coaching, job dating)",req:true},
       {label:"Suivi des anciens apprenants (enqu\u00eate insertion 6 mois)",req:true},
       {label:"Partenariats pour l\u2019emploi (France Travail, missions locales)",req:true},
       {label:"Taux d\u2019insertion et de poursuite d\u2019\u00e9tudes",req:true},
       {label:"Preuve de diffusion des r\u00e9sultats d\u2019insertion",req:false}
     ]},
    // CRITERE 7
    {id:30,c:7,cL:"Am\u00e9lioration continue",titre:"Recueil des appr\u00e9ciations",
     niveau:"Recueillir les appr\u00e9ciations des parties prenantes : b\u00e9n\u00e9ficiaires, financeurs, \u00e9quipes p\u00e9dagogiques, entreprises.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     neInfo:"Pr\u00e9voir la m\u00e9thodologie de recueil m\u00eame sans historique.",
     docs:[
       {label:"Questionnaire de satisfaction \u00e0 chaud (fin de formation)",req:true},
       {label:"Questionnaire de satisfaction \u00e0 froid (3-6 mois apr\u00e8s)",req:true},
       {label:"Enqu\u00eate aupr\u00e8s entreprises / financeurs / prescripteurs",req:true},
       {label:"Retours \u00e9quipe p\u00e9dagogique (d\u00e9briefing formateur)",req:false},
       {label:"Synth\u00e8se / compilation des r\u00e9sultats de satisfaction",req:true},
       {label:"Avis publics (Google, Mon Compte Formation)",req:false}
     ]},
    {id:31,c:7,cL:"Am\u00e9lioration continue",titre:"Traitement des difficult\u00e9s et r\u00e9clamations",
     niveau:"Traiter les difficult\u00e9s, r\u00e9clamations et al\u00e9as en cours de prestation.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     docs:[
       {label:"Proc\u00e9dure formalis\u00e9e de traitement des r\u00e9clamations",req:true},
       {label:"Registre des r\u00e9clamations (date, objet, traitement, suivi)",req:true},
       {label:"Preuves de traitement (courriers, emails, actions correctives)",req:true},
       {label:"Proc\u00e9dure de gestion des al\u00e9as (remplacement formateur, panne)",req:true},
       {label:"Modalit\u00e9s de recours / m\u00e9diation communiqu\u00e9es",req:false}
     ]},
    {id:32,c:7,cL:"Am\u00e9lioration continue",titre:"Mesures d\u2019am\u00e9lioration continue",
     niveau:"Mettre en \u0153uvre des mesures d\u2019am\u00e9lioration \u00e0 partir de l\u2019analyse des appr\u00e9ciations et r\u00e9clamations.",
     applies:{OF:true,CBC:true,VAE:true,CFA:true},
     neInfo:"Le nouveau prestataire pr\u00e9sente les modalit\u00e9s d\u2019am\u00e9lioration pr\u00e9vues.",
     docs:[
       {label:"Plan d\u2019am\u00e9lioration continue (actions, responsables, \u00e9ch\u00e9ances)",req:true},
       {label:"Compte-rendu de revue de direction / qualit\u00e9",req:true},
       {label:"Actions correctives mises en place (preuves dat\u00e9es)",req:true},
       {label:"Tableau de suivi des actions d\u2019am\u00e9lioration",req:true},
       {label:"Preuves d\u2019\u00e9volution des pratiques (avant/apr\u00e8s)",req:false}
     ]}
  ];

  var QI_COLORS = ["","#D85A30","#534AB7","#C9A84C","#1D9E75","#2563EB","#7C3AED","#059669"];
  var QI_LABELS = ["","Information du public","Objectifs et adaptation","Accompagnement","Moyens p\u00e9dagogiques","Qualification des personnels","Environnement socio-\u00e9conomique","Am\u00e9lioration continue"];

  var QI_ETATS = {
    vide:  {label:"\u00c0 compl\u00e9ter",color:"#9CA3AF",bg:"#F3F4F6",icon:"\u25CB"},
    etude: {label:"En \u00e9tude",color:"#C9A84C",bg:"#FAEEDA",icon:"\u25CE"},
    valide:{label:"Valid\u00e9",color:"#1D9E75",bg:"#E1F5EE",icon:"\u2713"},
    refuse:{label:"Refus\u00e9",color:"#DC2626",bg:"#FEE2E2",icon:"\u2715"}
  };

  var TYPES = ["OF","CBC","VAE","CFA"];
  var AUDITS = [
    {key:"initial",label:"Initial"},
    {key:"surveillance",label:"Surveillance"},
    {key:"renouvellement",label:"Renouvellement"}
  ];

  // ── HELPERS ───────────────────────────────────────────────

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "style" && typeof attrs[k] === "object") {
          Object.keys(attrs[k]).forEach(function (s) { e.style[s] = attrs[k][s]; });
        } else if (k === "className") {
          e.className = attrs[k];
        } else if (k.indexOf("on") === 0) {
          e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else {
          e.setAttribute(k, attrs[k]);
        }
      });
    }
    if (children) {
      if (!Array.isArray(children)) children = [children];
      children.forEach(function (ch) {
        if (typeof ch === "string") e.appendChild(document.createTextNode(ch));
        else if (ch) e.appendChild(ch);
      });
    }
    return e;
  }

  function css(obj) {
    return Object.keys(obj).reduce(function (s, k) {
      return s + k.replace(/([A-Z])/g, "-$1").toLowerCase() + ":" + obj[k] + ";";
    }, "");
  }

  // ── MAIN INIT ─────────────────────────────────────────────

  window.initQualiopiIndicateurs = function (hostId) {
    var host = document.getElementById(hostId || "qualiopi-indicateurs-host");
    if (!host) { console.warn("[QI] Host element not found:", hostId); return; }

    // Internal state
    var state = {
      typeFilter: ["OF"], // array of active types
      auditType: "initial",
      role: "client", // client | expert
      indicators: {},  // { [id]: { etat, docs: { [docIdx]: {uploaded, path, name} }, comments: [] } }
      openId: null
    };

    // Init indicator states
    QUALIOPI_INDICATEURS.forEach(function (ind) {
      state.indicators[ind.id] = { etat: "vide", docs: {}, comments: [] };
    });

    // Sync type filter from page STATE (set in step-0 configuration)
    function syncTypesFromPage() {
      if (typeof STATE === 'undefined' || !STATE.msValues || !STATE.msValues.type_qualiopi) return;
      var selected = STATE.msValues.type_qualiopi;
      if (!selected || !selected.length) return;
      var map = {'Action de formation':'OF','VAE':'VAE','Bilan de comp\u00e9tences':'CBC','Apprentissage':'CFA'};
      var types = [];
      selected.forEach(function(s) { if (map[s]) types.push(map[s]); });
      if (types.length) state.typeFilter = types;
    }
    syncTypesFromPage();
    // Also sync audit type from STATE.radioValues
    if (typeof STATE !== 'undefined' && STATE.radioValues && STATE.radioValues.type_audit) {
      var auditMap = {'Initial':'initial','Renouvellement':'renouvellement','Surveillance':'surveillance'};
      var a = auditMap[STATE.radioValues.type_audit];
      if (a) state.auditType = a;
    }

    // ── RENDER ─────────────────────────────────────────────

    function render() {
      host.innerHTML = "";
      host.appendChild(buildUI());
    }

    function buildUI() {
      var wrap = el("div", {style:{fontFamily:"'DM Sans', sans-serif", color:"#1F2937", maxWidth:"960px", margin:"0 auto"}});

      // ── Header
      var header = el("div", {style:{marginBottom:"20px"}});
      header.appendChild(el("h2", {style:{fontSize:"22px", fontWeight:"700", margin:"0 0 4px 0", color:"#111827"}}, "Indicateurs Qualiopi"));
      header.appendChild(el("p", {style:{fontSize:"14px", color:"#6B7280", margin:"0"}}, "32 indicateurs \u00b7 7 crit\u00e8res \u00b7 R\u00e9f\u00e9rentiel National Qualit\u00e9"));
      wrap.appendChild(header);

      // ── Filters row
      var filtersRow = el("div", {style:{display:"flex", flexWrap:"wrap", gap:"12px", marginBottom:"16px", alignItems:"center"}});

      // Type filter (multi-select)
      filtersRow.appendChild(el("span", {style:{fontSize:"13px", fontWeight:"600", color:"#374151"}}, "Types :"));
      TYPES.forEach(function (t) {
        var active = state.typeFilter.indexOf(t) >= 0;
        var btn = el("button", {
          style:{
            padding:"5px 14px", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer",
            border: active ? "2px solid #D85A30" : "1.5px solid #D1D5DB",
            background: active ? "#FEF3F0" : "#fff",
            color: active ? "#D85A30" : "#6B7280",
            transition:"all .15s"
          },
          onClick: function () {
            var idx = state.typeFilter.indexOf(t);
            if (idx >= 0) { state.typeFilter.splice(idx, 1); }
            else { state.typeFilter.push(t); }
            if (!state.typeFilter.length) state.typeFilter.push(t); // at least one
            render();
          }
        }, t);
        filtersRow.appendChild(btn);
      });

      // Spacer
      filtersRow.appendChild(el("span", {style:{flex:"1"}}));

      // Audit type
      filtersRow.appendChild(el("span", {style:{fontSize:"13px", fontWeight:"600", color:"#374151"}}, "Audit :"));
      AUDITS.forEach(function (a) {
        var active = state.auditType === a.key;
        var btn = el("button", {
          style:{
            padding:"5px 14px", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer",
            border: active ? "2px solid #534AB7" : "1.5px solid #D1D5DB",
            background: active ? "#EEEDFC" : "#fff",
            color: active ? "#534AB7" : "#6B7280",
            transition:"all .15s"
          },
          onClick: function () { state.auditType = a.key; render(); }
        }, a.label);
        filtersRow.appendChild(btn);
      });

      wrap.appendChild(filtersRow);

      // ── Role toggle
      var roleRow = el("div", {style:{display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px"}});
      roleRow.appendChild(el("span", {style:{fontSize:"13px", fontWeight:"600", color:"#374151"}}, "Vue :"));
      ["client","expert"].forEach(function (r) {
        var active = state.role === r;
        var label = r === "client" ? "Client" : "Expert";
        var btn = el("button", {
          style:{
            padding:"5px 16px", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer",
            border: active ? "2px solid #1D9E75" : "1.5px solid #D1D5DB",
            background: active ? "#E1F5EE" : "#fff",
            color: active ? "#1D9E75" : "#6B7280"
          },
          onClick: function () { state.role = r; render(); }
        }, label);
        roleRow.appendChild(btn);
      });
      wrap.appendChild(roleRow);

      // ── Progress bar
      var filtered = getFilteredIndicators();
      var validated = 0;
      filtered.forEach(function (ind) { if (state.indicators[ind.id].etat === "valide") validated++; });
      var pct = filtered.length ? Math.round((validated / filtered.length) * 100) : 0;

      var progWrap = el("div", {style:{marginBottom:"24px"}});
      var progLabel = el("div", {style:{display:"flex", justifyContent:"space-between", marginBottom:"6px"}});
      progLabel.appendChild(el("span", {style:{fontSize:"13px", fontWeight:"600", color:"#374151"}}, "Progression"));
      progLabel.appendChild(el("span", {style:{fontSize:"13px", fontWeight:"700", color: pct === 100 ? "#1D9E75" : "#D85A30"}}, validated + " / " + filtered.length + " valid\u00e9s (" + pct + " %)"));
      progWrap.appendChild(progLabel);

      var barOuter = el("div", {style:{height:"10px", borderRadius:"5px", background:"#E5E7EB", overflow:"hidden"}});
      barOuter.appendChild(el("div", {style:{height:"100%", width: pct + "%", borderRadius:"5px", background: pct === 100 ? "#1D9E75" : "#D85A30", transition:"width .3s"}}));
      progWrap.appendChild(barOuter);
      wrap.appendChild(progWrap);

      // ── Criteria groups
      var grouped = {};
      filtered.forEach(function (ind) {
        if (!grouped[ind.c]) grouped[ind.c] = [];
        grouped[ind.c].push(ind);
      });

      Object.keys(grouped).sort(function(a,b){return a-b;}).forEach(function (cKey) {
        var cNum = parseInt(cKey);
        var cColor = QI_COLORS[cNum];
        var cLabel = QI_LABELS[cNum];

        // Criteria header
        var cHeader = el("div", {style:{
          display:"flex", alignItems:"center", gap:"10px",
          padding:"10px 16px", marginBottom:"8px", marginTop:"20px",
          borderRadius:"10px",
          background: cColor + "12",
          borderLeft:"4px solid " + cColor
        }});
        cHeader.appendChild(el("span", {style:{fontSize:"13px", fontWeight:"800", color: cColor}}, "C" + cNum));
        cHeader.appendChild(el("span", {style:{fontSize:"14px", fontWeight:"600", color:"#374151"}}, cLabel));

        // Count badge
        var cValid = 0;
        grouped[cKey].forEach(function (ind) { if (state.indicators[ind.id].etat === "valide") cValid++; });
        cHeader.appendChild(el("span", {style:{
          marginLeft:"auto", fontSize:"12px", fontWeight:"600", padding:"2px 10px",
          borderRadius:"12px", background: cValid === grouped[cKey].length ? "#E1F5EE" : "#F3F4F6",
          color: cValid === grouped[cKey].length ? "#1D9E75" : "#6B7280"
        }}, cValid + "/" + grouped[cKey].length));

        wrap.appendChild(cHeader);

        // Indicator cards
        grouped[cKey].forEach(function (ind) {
          wrap.appendChild(buildIndicatorCard(ind, cColor));
        });
      });

      return wrap;
    }

    // ── Filtered indicators based on selected types (union)
    function getFilteredIndicators() {
      return QUALIOPI_INDICATEURS.filter(function (ind) {
        for (var i = 0; i < state.typeFilter.length; i++) {
          if (ind.applies[state.typeFilter[i]]) return true;
        }
        return false;
      });
    }

    // ── Indicator card
    function buildIndicatorCard(ind, cColor) {
      var s = state.indicators[ind.id];
      var etatInfo = QI_ETATS[s.etat];
      var isOpen = state.openId === ind.id;

      var card = el("div", {style:{
        background:"#fff", border:"1px solid #E5E7EB", borderRadius:"12px",
        marginBottom:"8px", overflow:"hidden", transition:"all .15s"
      }});

      // ── Card header (clickable)
      var hdr = el("div", {style:{
        display:"flex", alignItems:"center", gap:"10px", padding:"12px 16px",
        cursor:"pointer", userSelect:"none"
      }, onClick: function () {
        state.openId = isOpen ? null : ind.id;
        render();
      }});

      // Indicator number badge
      hdr.appendChild(el("span", {style:{
        width:"32px", height:"32px", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:"13px", fontWeight:"700", color:"#fff", background: cColor, flexShrink:"0"
      }}, String(ind.id)));

      // Title
      var titleCol = el("div", {style:{flex:"1", minWidth:"0"}});
      titleCol.appendChild(el("div", {style:{fontSize:"14px", fontWeight:"600", color:"#111827", lineHeight:"1.3"}}, ind.titre));
      if (ind.neInfo && state.auditType === "initial") {
        titleCol.appendChild(el("div", {style:{fontSize:"11px", color:"#9CA3AF", marginTop:"2px", fontStyle:"italic"}}, "NE : " + ind.neInfo));
      }
      hdr.appendChild(titleCol);

      // Status badge
      hdr.appendChild(el("span", {style:{
        padding:"4px 12px", borderRadius:"8px", fontSize:"12px", fontWeight:"600",
        color: etatInfo.color, background: etatInfo.bg, whiteSpace:"nowrap", flexShrink:"0"
      }}, etatInfo.icon + " " + etatInfo.label));

      // Chevron
      hdr.appendChild(el("span", {style:{fontSize:"16px", color:"#9CA3AF", transition:"transform .2s", transform: isOpen ? "rotate(180deg)" : "rotate(0)"}}, "\u25BE"));

      card.appendChild(hdr);

      // ── Expanded body
      if (isOpen) {
        var body = el("div", {style:{
          padding:"0 16px 16px 16px",
          borderTop:"1.5px dashed #D1D5DB"
        }});

        // Niveau
        body.appendChild(el("div", {style:{
          fontSize:"13px", color:"#4B5563", lineHeight:"1.5",
          padding:"12px 14px", margin:"12px 0",
          background:"#FAFAFA", borderRadius:"10px",
          border:"1.5px dashed #D1D5DB"
        }}, ind.niveau));

        // Expert: state control buttons
        if (state.role === "expert") {
          var stateRow = el("div", {style:{display:"flex", gap:"8px", marginBottom:"14px", flexWrap:"wrap"}});
          stateRow.appendChild(el("span", {style:{fontSize:"12px", fontWeight:"600", color:"#374151", alignSelf:"center"}}, "\u00c9tat :"));
          ["vide","etude","valide","refuse"].forEach(function (ek) {
            var ei = QI_ETATS[ek];
            var isActive = s.etat === ek;
            var btn = el("button", {
              style:{
                padding:"4px 12px", borderRadius:"8px", fontSize:"12px", fontWeight:"600", cursor:"pointer",
                border: isActive ? "2px solid " + ei.color : "1.5px solid #D1D5DB",
                background: isActive ? ei.bg : "#fff",
                color: ei.color
              },
              onClick: function () {
                state.indicators[ind.id].etat = ek;
                render();
              }
            }, ei.icon + " " + ei.label);
            stateRow.appendChild(btn);
          });
          body.appendChild(stateRow);
        }

        // Documents list
        body.appendChild(el("div", {style:{fontSize:"13px", fontWeight:"700", color:"#374151", marginBottom:"8px"}}, "Documents \u00e0 fournir"));

        ind.docs.forEach(function (doc, di) {
          var docState = s.docs[di] || {};
          var docRow = el("div", {style:{
            display:"flex", alignItems:"flex-start", gap:"8px",
            padding:"10px 12px", marginBottom:"6px",
            background: docState.uploaded ? "#E1F5EE" : (doc.req ? "#FAFAFA" : "#fff"),
            border:"1px solid " + (docState.uploaded ? "#A7F3D0" : "#E5E7EB"),
            borderRadius:"10px"
          }});

          // Required badge
          docRow.appendChild(el("span", {style:{
            fontSize:"10px", fontWeight:"700", padding:"2px 6px", borderRadius:"4px",
            background: doc.req ? "#FEF3F0" : "#F3F4F6",
            color: doc.req ? "#D85A30" : "#9CA3AF",
            flexShrink:"0", marginTop:"2px"
          }}, doc.req ? "REQ" : "OPT"));

          // Label
          var labelWrap = el("div", {style:{flex:"1", minWidth:"0"}});
          labelWrap.appendChild(el("span", {style:{fontSize:"13px", color:"#374151", lineHeight:"1.4"}}, doc.label));
          if (docState.uploaded) {
            labelWrap.appendChild(el("div", {style:{fontSize:"11px", color:"#1D9E75", marginTop:"3px"}}, "\u2713 " + (docState.name || "Upload\u00e9")));
          }
          docRow.appendChild(labelWrap);

          // Action buttons
          var actions = el("div", {style:{display:"flex", gap:"6px", flexShrink:"0"}});

          if (state.role === "client") {
            // "Je l'ai" upload button
            var uploadBtn = el("button", {
              style:{
                padding:"4px 10px", borderRadius:"6px", fontSize:"11px", fontWeight:"600", cursor:"pointer",
                border:"1.5px solid #D85A30", background: docState.uploaded ? "#E1F5EE" : "#FEF3F0", color: docState.uploaded ? "#1D9E75" : "#D85A30"
              },
              onClick: function () { triggerUpload(ind.id, di); }
            }, docState.uploaded ? "Remplacer" : "Je l'ai");
            actions.appendChild(uploadBtn);

            // "Creez-le" button
            var createBtn = el("button", {
              style:{
                padding:"4px 10px", borderRadius:"6px", fontSize:"11px", fontWeight:"600", cursor:"pointer",
                border:"1.5px solid #534AB7", background:"#EEEDFC", color:"#534AB7"
              },
              onClick: function () { alert("Demande envoy\u00e9e \u00e0 votre expert. Il va g\u00e9n\u00e9rer ce document pour vous."); }
            }, "Cr\u00e9ez-le");
            actions.appendChild(createBtn);
          }

          if (state.role === "expert" && docState.uploaded) {
            // View link
            var viewBtn = el("button", {
              style:{
                padding:"4px 10px", borderRadius:"6px", fontSize:"11px", fontWeight:"600", cursor:"pointer",
                border:"1.5px solid #2563EB", background:"#EFF6FF", color:"#2563EB"
              },
              onClick: function () { viewDocument(docState.path); }
            }, "Voir");
            actions.appendChild(viewBtn);
          }

          docRow.appendChild(actions);
          body.appendChild(docRow);
        });

        // ── Comments section
        body.appendChild(el("div", {style:{
          fontSize:"13px", fontWeight:"700", color:"#374151",
          marginTop:"16px", marginBottom:"8px"
        }}, "Commentaires"));

        var commentsBox = el("div", {style:{
          border:"1.5px dashed #D1D5DB", borderRadius:"10px",
          padding:"10px", maxHeight:"200px", overflowY:"auto",
          background:"#FAFAFA", marginBottom:"8px"
        }});

        if (s.comments.length === 0) {
          commentsBox.appendChild(el("div", {style:{fontSize:"12px", color:"#9CA3AF", fontStyle:"italic"}}, "Aucun commentaire"));
        } else {
          s.comments.forEach(function (c) {
            var isExpert = c.role === "expert";
            var bubble = el("div", {style:{
              padding:"6px 10px", marginBottom:"6px", borderRadius:"8px",
              fontSize:"12px", lineHeight:"1.4",
              background: isExpert ? "#EEEDFC" : "#FEF3F0",
              color:"#374151",
              borderLeft: "3px solid " + (isExpert ? "#534AB7" : "#D85A30")
            }});
            bubble.appendChild(el("div", {style:{fontWeight:"700", fontSize:"11px", color: isExpert ? "#534AB7" : "#D85A30", marginBottom:"2px"}}, isExpert ? "Expert" : "Client"));
            bubble.appendChild(el("span", null, c.text));
            commentsBox.appendChild(bubble);
          });
        }
        body.appendChild(commentsBox);

        // Comment input
        var commentRow = el("div", {style:{display:"flex", gap:"6px"}});
        var commentInput = el("input", {
          type:"text",
          placeholder:"Votre commentaire...",
          style:{
            flex:"1", padding:"8px 12px", borderRadius:"8px", fontSize:"13px",
            border:"1.5px solid #D1D5DB", outline:"none", fontFamily:"'DM Sans', sans-serif"
          }
        });
        commentInput.addEventListener("focus", function () { this.style.borderColor = "#D85A30"; });
        commentInput.addEventListener("blur", function () { this.style.borderColor = "#D1D5DB"; });
        commentRow.appendChild(commentInput);

        var sendBtn = el("button", {
          style:{
            padding:"8px 16px", borderRadius:"8px", fontSize:"13px", fontWeight:"600",
            cursor:"pointer", border:"none", background:"#D85A30", color:"#fff"
          },
          onClick: function () {
            var txt = commentInput.value.trim();
            if (!txt) return;
            state.indicators[ind.id].comments.push({ role: state.role, text: txt, ts: Date.now() });
            render();
          }
        }, "Envoyer");
        commentRow.appendChild(sendBtn);
        body.appendChild(commentRow);

        card.appendChild(body);
      }

      return card;
    }

    // ── UPLOAD HANDLER ─────────────────────────────────────

    function triggerUpload(indId, docIdx) {
      var inp = document.createElement("input");
      inp.type = "file";
      inp.accept = ".pdf,.jpg,.jpeg,.png,.docx";
      inp.onchange = async function () {
        var f = inp.files[0];
        if (!f) return;

        var user = null;
        try {
          var sess = await sb.auth.getSession();
          if (sess.data && sess.data.session) user = sess.data.session.user;
        } catch (e) { /* ignore */ }
        if (!user) {
          try {
            var r = await sb.auth.getUser();
            if (r.data && r.data.user) user = r.data.user;
          } catch (e) { /* ignore */ }
        }
        if (!user) { alert("Connectez-vous pour envoyer un document."); return; }

        var path = user.id + "/qualiopi/ind" + indId + "_doc" + docIdx + "_" + Date.now() + "_" + f.name;

        try {
          var res = await sb.storage.from("documents").upload(path, f, { contentType: f.type });
          if (res.error) {
            alert("Erreur upload : " + (res.error.message || "inconnue"));
            return;
          }
          state.indicators[indId].docs[docIdx] = { uploaded: true, path: path, name: f.name };
          render();
        } catch (err) {
          alert("Erreur : " + (err.message || "inconnue"));
        }
      };
      inp.click();
    }

    // ── VIEW DOCUMENT ──────────────────────────────────────

    async function viewDocument(path) {
      if (!path) return;
      try {
        var res = sb.storage.from("documents").getPublicUrl(path);
        if (res.data && res.data.publicUrl) {
          window.open(res.data.publicUrl, "_blank");
        } else {
          // Fallback: create signed URL
          var signed = await sb.storage.from("documents").createSignedUrl(path, 3600);
          if (signed.data && signed.data.signedUrl) {
            window.open(signed.data.signedUrl, "_blank");
          } else {
            alert("Impossible de g\u00e9n\u00e9rer le lien du document.");
          }
        }
      } catch (e) {
        alert("Erreur : " + (e.message || "inconnue"));
      }
    }

    // ── INITIAL RENDER ─────────────────────────────────────
    render();
  };

})();
