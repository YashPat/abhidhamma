import type { Confusion } from './types';
import { cetasikas } from './cetasikas.ts';
import { matchesWords, queryWords } from './search.ts';

export const confusions: Confusion[] = [
	{
		id: 'contact-feeling-perception',
		title: 'Contact, feeling, and perception',
		lede: 'These three are what people collapse into "an experience."',
		together: 'jobs',
		togetherText:
			'All three are in every one of the 89 cittas, in the same moment. The sampayoga sheet is explicit that contact does not precede feeling by an interval. Nothing in this set is the one that "showed up instead."',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'Contact is the meeting of faculty, object, and consciousness. Feeling is the tone: pleasant, unpleasant, or neither, and not the emotion that may follow. Perception marks the object against memory, so a shape becomes "a cup" or "my friend."'
			}
		],
		members: [
			{ id: 'phassa', tell: 'The meeting that makes a moment possible. Not the tone, and not the label.' },
			{ id: 'vedana', tell: 'The tone only. Not the emotion that may follow, and not the name of the thing.' },
			{ id: 'sanna', tell: 'The label, already shaped by memory. Not the fact that something was met.' }
		],
		keywords: ['contact', 'feeling', 'perception', 'emotion', 'phassa', 'vedana', 'sanna']
	},
	{
		id: 'feeling-and-rapture',
		title: 'Feeling and rapture',
		lede: 'A pleasant thrill feels like one thing. The sheets split it.',
		together: 'partial',
		togetherText:
			'Rapture requires joyful feeling and is not guaranteed by it. It drops out of every citta whose feeling is not joyful, out of both hatred-rooted cittas, and out of body-consciousness. It also drops out of the fourth jhāna, which keeps a pleasant feeling.',
		quote: {
			text: 'Pīti is the traveller’s elation at sighting water, sukha is the ease of drinking it.',
			source: 'Sampayoga sheet'
		},
		notes: [
			{
				kind: 'rule',
				source: 'Sampayoga sheet, on pīti and somanassa',
				text: 'Sixty-two cittas have joyful feeling and rapture arises in fifty-one of them. The eleven left out are the fourth-jhāna cittas. That gap is the sheet’s evidence that the two are not one factor named twice. Bodily pleasure is one citta, the wholesome-resultant body-consciousness. The jhāna factor sukha is mental joy, somanassa, and it remains in the fourth jhāna after rapture drops.'
			}
		],
		members: [
			{
				id: 'vedana',
				tell: 'The tone: pleasant, unpleasant, or neither. In the water simile, this is the ease of drinking.'
			},
			{
				id: 'piti',
				tell: 'Interest and thrill in the object. In the simile, the elation at sighting water. It can be absent while the pleasant tone remains.'
			}
		],
		keywords: ['rapture', 'piti', 'sukha', 'somanassa', 'pleasant', 'joy', 'feeling']
	},
	{
		id: 'intention-wish-greed',
		title: 'Intention, wish, and greed',
		lede: '"I want that" can be any of three different jobs.',
		together: 'partial',
		togetherText:
			'Intention is in all 89 cittas, including the greedy ones. Wish can occur together with greed; the cetasika sheet says so. Wish is absent from the eighteen rootless cittas and the two delusion-rooted ones. Greed is only the eight greed-rooted cittas. A greedy moment contains intention and wish, and the greed is the sticking.',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'Intention organizes the mind toward its object and is in all 89 cittas. It accumulates kamma in wholesome and unwholesome cittas, and that happens in the javanas. In a resultant or functional citta, including a rootless sense consciousness, it organizes the moment and plants nothing. Wish is the desire to act, ethically variable: it can keep company with craving, or be the wish to practice. Greed sticks to its object, from mild attraction to craving, "like meat to a hot pan."'
			}
		],
		members: [
			{ id: 'cetana', tell: 'The organizing drive in every moment. Not a kind of wanting you could decline.' },
			{ id: 'chanda', tell: 'The wish to do something. Can sit inside greed, or inside a wholesome aim.' },
			{ id: 'lobha', tell: 'The sticking, the holding on. Not the mere wish to act.' }
		],
		keywords: ['intention', 'wish', 'greed', 'craving', 'desire', 'chanda', 'lobha', 'cetana']
	},
	{
		id: 'initial-and-sustained',
		title: 'Initial application and sustained application',
		lede: 'The bee flies at the flower, then it circles. Both are easy to hear as "thinking."',
		together: 'partial',
		togetherText:
			'They can share a moment. The first jhāna has both. At the second jhāna, initial application drops and sustained application remains. The citta sheet’s jhāna table is that sequence. Neither factor is present in the ten sense consciousnesses.',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'Initial application is the mind’s first movement onto the object, likened to a bee flying toward a flower. Sustained application is the continued examination once it has arrived, the bee circling. Where one strikes, the other keeps rubbing. Ordinary thinking depends on initial application; the factor itself is the directing, not the essay.'
			}
		],
		members: [
			{ id: 'vitakka', tell: 'The first throw onto the object. Not the sentences that may follow.' },
			{ id: 'vicara', tell: 'The continued working of an object already reached.' }
		],
		keywords: ['vitakka', 'vicara', 'thinking', 'jhana', 'application']
	},
	{
		id: 'determination-and-doubt',
		title: 'Determination and doubt',
		lede: 'One commits. The other will not. They are not two moods of the same factor.',
		together: 'exclusive',
		togetherText:
			'The doubt-accompanied citta lacks determination entirely. It is the only citta, outside the ten sense consciousnesses, from which determination is absent.',
		notes: [
			{
				kind: 'rule',
				source: 'Sampayoga sheet, Exclusivity and Co-Arising Rules',
				text: 'Determination commits to the object and doubt refuses to. The sheet says they are not merely opposed in tendency but mutually exclusive in function, so no citta can contain both. Even one-pointedness, present because it is universal, is too weak in that citta to hold the object steady.'
			}
		],
		members: [
			{ id: 'adhimokkha', tell: 'The mind sets, like a stone pillar. Wavering is not in that moment.' },
			{
				id: 'vicikiccha',
				tell: 'A stall, not an honest question you then pursue. This one citta has no determination in it.'
			}
		],
		keywords: ['doubt', 'determination', 'decision', 'vicikiccha', 'adhimokkha']
	},
	{
		id: 'energy-and-restlessness',
		title: 'Energy and restlessness',
		lede: 'Both can feel like being wired. They are not the same job, and an unwholesome moment has both.',
		together: 'partial',
		togetherText:
			'Energy is in 73 cittas, including all 12 unwholesome ones. It is missing from sixteen rootless cittas. Restlessness is in all 12 unwholesome cittas and nowhere else. So every restless moment also has energy. Beautiful moments have energy and cannot have restlessness. The sheets do not make the two mutually exclusive.',
		notes: [
			{
				kind: 'function',
				source: 'Cetasika sheet, read with the sampayoga ranges',
				text: 'Energy musters effort for whatever the mind is doing, wholesome or unwholesome. Restlessness is agitation that cannot settle, compared to ash struck by a stone, and it helps make a moment unwholesome. "This undercuts that" would overclaim. In an unwholesome moment the effort and the scattering are both there. The difference is the job: feeding the action, or failing to settle.'
			}
		],
		members: [
			{ id: 'viriya', tell: 'Effort fed in, which can serve a kind aim or a cruel one.' },
			{ id: 'uddhacca', tell: 'The scattering itself. Present even in a pleasant greedy moment, where nothing is being regretted.' }
		],
		keywords: ['energy', 'restlessness', 'effort', 'agitation', 'viriya', 'uddhacca', 'wired']
	},
	{
		id: 'life-and-energy',
		title: 'Life faculty and energy',
		lede: '"How much life is in this?" is usually a question about energy. The life faculty is not that.',
		together: 'partial',
		togetherText:
			'The life faculty is in all 89 cittas. Energy is in 73, and missing from sixteen rootless cittas. Whenever energy is present, the life faculty is present too. A flat, receiving moment can have the life faculty and no energy at all.',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'The life faculty sustains the other mental factors for the moment they exist together, "like water to lotuses." It maintains what is present without creating it. Energy is the willingness to keep going, "like fresh troops reinforcing an army," and it can serve either kind of aim.'
			}
		],
		members: [
			{ id: 'jivitindriya', tell: 'What keeps this moment’s factors going for this moment. Not your energy level.' },
			{ id: 'viriya', tell: 'Effort actually being mustered. Absent from bare reception.' }
		],
		keywords: ['life', 'energy', 'vitality', 'jivitindriya', 'viriya', 'tired']
	},
	{
		id: 'delusion-view-doubt',
		title: 'Delusion, wrong view, and doubt',
		lede: 'Not-seeing, a convinced wrong picture, and a stall are three different moments.',
		together: 'partial',
		togetherText:
			'Delusion is in all 12 unwholesome cittas. Wrong view is fixed in 4 greed-rooted cittas. Doubt is in 1 citta, the delusion-rooted citta with doubt. A view-moment contains delusion. A doubt-moment contains delusion and does not contain view, because view’s cittas are the greed-rooted ones.',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'Delusion is not seeing things as they are. Wrong view is seeing them wrongly and being convinced; the sheet says it is worse than plain ignorance because it interprets confidently. Doubt is wavering that cannot commit, and the sheet says it is not honest inquiry.'
			}
		],
		members: [
			{ id: 'moha', tell: 'The not-seeing underneath every unwholesome moment, including the sharp ones.' },
			{ id: 'ditthi', tell: 'A settled, confident picture, most deeply the picture of a lasting self.' },
			{ id: 'vicikiccha', tell: 'Unable to commit. One citta only, and it is not a view.' }
		],
		keywords: ['delusion', 'wrong view', 'doubt', 'moha', 'ditthi', 'ignorance', 'confusion']
	},
	{
		id: 'confidence-and-view',
		title: 'Confidence and wrong view',
		lede: 'Both feel like conviction. One clarifies. The other settles a false picture.',
		together: 'exclusive',
		togetherText:
			'They do not share a moment. Confidence is one of the nineteen factors in all 59 beautiful cittas. Wrong view is confined to 4 greed-rooted cittas. That is the general split between beautiful and unwholesome classes. It is true of every such pair, and it is not a special rule about these two. The useful difference is what the conviction is doing.',
		notes: [
			{
				kind: 'class',
				source: 'Sampayoga sheet, the ranges',
				text: 'Unwholesome factors are confined to the 12 unwholesome cittas. Beautiful factors belong to the 59 beautiful cittas. One citta is one nature, so the ranges do not overlap.'
			},
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'Wrong view interprets and is convinced, taking what is not a self to be a self. Confidence is trust placed in what is worthy of it — the Buddha, the Dhamma, and the Sangha — and the sheet says it is not blind belief. It clarifies, "the way a water-purifying gem settles sediment."'
			}
		],
		members: [
			{ id: 'ditthi', tell: 'Convinced, and wrong. A picture of a self, settled.' },
			{ id: 'saddha', tell: 'Trust that lets you look. Not a view you are defending.' }
		],
		keywords: ['faith', 'confidence', 'wrong view', 'belief', 'saddha', 'ditthi']
	},
	{
		id: 'shame-and-fear',
		title: 'Shame, moral fear, and their absence',
		lede: 'Four factors, two pairs. English uses "conscience" for all of them.',
		together: 'partial',
		togetherText:
			'Shamelessness and moral fearlessness are together in all 12 unwholesome cittas. Moral shame and moral fear are together in all 59 beautiful cittas. Within a pair, both are present: they are not alternatives. Across the line they do not mix, because one pair is unwholesome and the other is beautiful. That class split is general. It says nothing special about this quartet. What is special is the inward face and the outward face.',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'Shamelessness is no inner recoil, "like a village pig." Moral fearlessness is recklessness about consequences, "a hot coal." Moral shame says this is beneath me, from self-respect. Moral fear dreads the harm, the blame, and the kamma. The sheet says shame looks inward and moral fear looks outward, and calls the wholesome pair guardians of the world.'
			}
		],
		members: [
			{ id: 'ahirika', tell: 'No inward "this is beneath me." In every unwholesome moment.' },
			{ id: 'anottappa', tell: 'No heed of the consequence. In every unwholesome moment, beside shamelessness.' },
			{ id: 'hiri', tell: 'The recoil from your own dignity. Looks inward.' },
			{ id: 'ottappa', tell: 'Dread of what the act will do. Looks outward. Not a substitute for shame.' }
		],
		keywords: ['shame', 'guilt', 'conscience', 'hiri', 'ottappa', 'ahirika', 'anottappa', 'fear of blame']
	},
	{
		id: 'two-fears',
		title: 'Two kinds of fear',
		lede: 'Flinching from a threat, and drawing back from your own wrongdoing, are different factors.',
		together: 'exclusive',
		togetherText:
			'They do not share a moment. Hatred is confined to the 2 hatred-rooted cittas. Moral fear is in all 59 beautiful cittas. The class split is general. The difference that matters here is the object of the fear.',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet and the citta sheet',
				text: 'The cetasika sheet lists fear among the forms of hatred: the mind strikes against what it does not want. Moral fear is a healthy dread of the consequences of wrongdoing. The citta sheet says displeasure occurs in exactly two cittas, both hatred-rooted, so the unpleasant tone of a flinch travels with hatred. Moral fear belongs to a beautiful citta, whose feeling is joy or neutral, not displeasure.'
			}
		],
		members: [
			{ id: 'dosa', tell: 'The flinch that strikes against a threat, a person, a pain you want gone.' },
			{ id: 'ottappa', tell: 'Drawing back because of the harm your own act would do.' }
		],
		keywords: ['fear', 'anxiety', 'dosa', 'ottappa', 'afraid', 'scared']
	},
	{
		id: 'greed-view-conceit',
		title: 'Greed, wrong view, and conceit',
		lede: 'Wanting, a dogma about yourself, and a ranking of yourself come apart.',
		together: 'partial',
		togetherText:
			'Wrong view and conceit never share a moment. Greed is the root of both of their cittas: view in four of the eight greed-rooted cittas, conceit only in the other four, and even there conceit is unfixed. Most greedy moments contain no conceit at all.',
		notes: [
			{
				kind: 'rule',
				source: 'Sampayoga sheet, Exclusivity and Co-Arising Rules',
				text: 'Both are forms of self-appropriation, and they operate differently. Wrong view construes the object as a self and settles it. Conceit measures a presumed self as better, equal, or worse. The sheet says the commentaries compare them to two lions that do not share one den.'
			}
		],
		members: [
			{ id: 'lobha', tell: 'The sticking. Can be there with view, or with conceit, or with neither.' },
			{ id: 'ditthi', tell: 'A convinced picture of a self. Occupies four greed-rooted cittas, and conceit is locked out of those.' },
			{ id: 'mana', tell: 'The ranking: better, equal, or worse. All three are conceit. Often absent even where it is allowed.' }
		],
		keywords: ['conceit', 'pride', 'wrong view', 'ego', 'comparison', 'mana', 'ditthi', 'self']
	},
	{
		id: 'hatred-family',
		title: 'Hatred, envy, stinginess, and remorse',
		lede: 'Four names for what it is like to be contracted and unhappy. Only hatred is required.',
		together: 'partial',
		togetherText:
			'Envy, stinginess, and remorse arise singly and never together. Each needs a different object, and one citta has one object. All three are listed in the totals for the hatred-rooted cittas, which is why those totals overstate what is actually there. Each is unfixed. A hatred-rooted citta is complete with none of them. Hatred itself is fixed in those two cittas.',
		notes: [
			{
				kind: 'rule',
				source: 'Sampayoga sheet, Exclusivity and Co-Arising Rules',
				text: 'Envy takes another’s success. Stinginess takes one’s own possession or standing. Remorse takes one’s own past deed. The cetasika sheet draws the envy/stinginess line in one sentence: envy grudges what others have; stinginess grudges what others might get from oneself.'
			}
		],
		members: [
			{ id: 'dosa', tell: 'The striking itself. Present whether or not envy, stinginess, or remorse joins it.' },
			{ id: 'issa', tell: 'Cannot bear their good fortune. The object is what they have.' },
			{ id: 'macchariya', tell: 'Will not let go of what is yours. The object is what they might get from you.' },
			{ id: 'kukkucca', tell: 'Gnawing on your own past deed or omission. Not free-floating scatter.' }
		],
		keywords: ['envy', 'jealousy', 'stinginess', 'remorse', 'guilt', 'hatred', 'anger', 'issa', 'macchariya', 'kukkucca']
	},
	{
		id: 'envy-and-joy',
		title: 'Envy and sympathetic joy',
		lede: 'The same news: someone else is doing well. The moment either cannot bear it or is glad.',
		together: 'exclusive',
		togetherText:
			'They do not share a moment. Part of that is only the class split: envy is unwholesome and sympathetic joy is beautiful, which is true of every such pair and is not a special fact about these two. Sympathetic joy is also unfixed, so a beautiful moment can lack it. Envy is unfixed too, so a hatred moment can lack it.',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'What is specific: envy cannot bear another’s success, gain, or good qualities. Sympathetic joy is gladness at another’s happiness, and the sheet says it directly opposes envy, which cannot bear the same news.'
			}
		],
		members: [
			{ id: 'issa', tell: 'Their good fortune is unbearable. A hatred moment, and an optional one.' },
			{ id: 'mudita', tell: 'Their good fortune is welcome. A beautiful moment, and an optional one.' }
		],
		keywords: ['envy', 'jealousy', 'sympathetic joy', 'mudita', 'issa', 'comparison']
	},
	{
		id: 'greed-and-hatred',
		title: 'Greed and hatred',
		lede: 'What feels like love-hate is two moments, close enough to seem like one.',
		together: 'exclusive',
		togetherText:
			'They never co-arise. Delusion accompanies both. A citta has one object: greed sticks to it, hatred strikes against it.',
		notes: [
			{
				kind: 'rule',
				source: 'Sampayoga sheet, Exclusivity and Co-Arising Rules',
				text: 'The feeling settles it too. Hatred is invariably accompanied by displeasure, and greed never is. The sheet says what people call love-hate is an alternation, rapid enough to feel simultaneous. Delusion is in all twelve unwholesome cittas; greed in eight; hatred in two.'
			}
		],
		members: [
			{ id: 'lobha', tell: 'Sticks. Never accompanied by displeasure.' },
			{ id: 'dosa', tell: 'Strikes. Always accompanied by displeasure.' }
		],
		keywords: ['greed', 'hatred', 'love-hate', 'anger', 'craving', 'lobha', 'dosa']
	},
	{
		id: 'sloth-and-torpor',
		title: 'Sloth and torpor',
		lede: 'One word, "tired," covers a limp knowing and a heavy retinue.',
		together: 'jobs',
		togetherText:
			'The sampayoga sheet lists them on one row: the 5 prompted unwholesome cittas. Both are unfixed, so a prompted citta is complete without them. When either is present, the other is present. They do not arise in unprompted unwholesome cittas. The difference is which side of the moment goes dull.',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'Sloth is the sluggishness of consciousness itself, "like a bat hanging on a tree." Torpor is the dullness of the accompanying factors. "Thīna afflicts the mind, middha its retinue." Together they are one of the five hindrances. They are not the life faculty running low, and they are not simply the absence of the energy factor.'
			}
		],
		members: [
			{ id: 'thina', tell: 'Consciousness itself gone limp.' },
			{ id: 'middha', tell: 'The other factors heavy, fuzzy, sunk.' }
		],
		keywords: ['sloth', 'torpor', 'tired', 'lazy', 'sleepy', 'thina', 'middha', 'hindrance']
	},
	{
		id: 'attention-perception-mindfulness',
		title: 'Attention, perception, and mindfulness',
		lede: '"I noticed" can mean any of these. Only one of them is mindfulness.',
		together: 'partial',
		togetherText:
			'Attention and perception are in all 89 cittas, including every unwholesome one. Mindfulness is one of the nineteen beautiful universals, present in all 59 beautiful cittas and nowhere else. If the moment is greedy or angry, mindfulness is not the factor that noticed.',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet and the sampayoga ranges',
				text: 'Attention steers consciousness onto one object. It is the rudder, and whether it is wise or unwise largely determines what follows. Perception labels. Mindfulness remembers to stay with what is happening without skimming, and it keeps the wholesome in view. The sampayoga sheet draws the practical conclusion: there is no wholesome moment without mindfulness in it. The converse is the one that clears the mix-up: there is no mindfulness in an unwholesome moment.'
			}
		],
		members: [
			{ id: 'manasikara', tell: 'The steering onto an object. Present while you are angry, greedy, or confused.' },
			{ id: 'sanna', tell: 'The label: "anger," "a cup," "my sister." Also present in those moments.' },
			{ id: 'sati', tell: 'Staying with what is actually happening, without floating off. Beautiful moments only.' }
		],
		keywords: ['mindfulness', 'attention', 'perception', 'noticing', 'sati', 'manasikara', 'sanna']
	},
	{
		id: 'onepointedness-and-mindfulness',
		title: 'One-pointedness and mindfulness',
		lede: 'Concentration and mindfulness get used as one instruction. They are different factors.',
		together: 'partial',
		togetherText:
			'One-pointedness is in all 89 cittas, including restless and doubtful ones. The sampayoga sheet says that in the doubt-accompanied citta it is too weak to hold the object steady. Mindfulness is only in the 59 beautiful cittas. A beautiful moment has both. A scattered unwholesome moment has one-pointedness and does not have mindfulness.',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'One-pointedness unifies the mind on a single object. Developed, it matures into samādhi. Mindfulness is non-superficial remembering: the mind sinks into the object rather than skimming it. Strengthening one-pointedness does not turn it into mindfulness.'
			}
		],
		members: [
			{ id: 'ekaggata', tell: 'One object, weakly or strongly. Present when the mind is a mess.' },
			{ id: 'sati', tell: 'Not skimming that object, and keeping the wholesome in view. Beautiful moments only.' }
		],
		keywords: ['concentration', 'mindfulness', 'samadhi', 'ekaggata', 'sati', 'focus']
	},
	{
		id: 'mindfulness-and-wisdom',
		title: 'Mindfulness and wisdom',
		lede: 'Knowing that anger is here is not the same as seeing through it.',
		together: 'partial',
		togetherText:
			'They can share a moment. Mindfulness is in all 59 beautiful cittas. Wisdom is in 47: the sense-sphere beautiful cittas "with knowledge," plus all fine-material, immaterial, and supramundane cittas. The citta sheet’s "without knowledge" class is a beautiful moment with mindfulness and without wisdom.',
		notes: [
			{
				kind: 'function',
				source: 'Cetasika sheet',
				text: 'The sheets do not say these exclude each other. Mindfulness keeps the mind from skimming and keeps the wholesome in view. Wisdom understands impermanence, unsatisfactoriness, and not-self, and the sheet says it is the factor that uproots delusion. Remembering the anger is present is mindfulness. Seeing the anger as a surge that is not a self is wisdom.'
			}
		],
		members: [
			{ id: 'sati', tell: 'Knows what is here and stays with it.' },
			{ id: 'pannindriya', tell: 'Sees the three characteristics. This is what uproots delusion. It can be missing from a genuinely wholesome moment.' }
		],
		keywords: ['wisdom', 'mindfulness', 'insight', 'panna', 'sati', 'knowledge']
	},
	{
		id: 'four-attitudes',
		title: 'Goodwill, compassion, sympathetic joy, and equanimity',
		lede: 'Four different beautiful jobs, often folded into "being kind" or "being fine."',
		together: 'partial',
		togetherText:
			'Non-hatred and equanimity are two of the nineteen factors fixed in every beautiful citta. Compassion and sympathetic joy are unfixed, occur in 28 cittas, and never together: one takes a suffering being, the other a happy one. Neither occurs in the supramundane, because the object there is Nibbāna, not a being. A beautiful moment always has goodwill and balance. It often has neither compassion nor sympathetic joy.',
		notes: [
			{
				kind: 'rule',
				source: 'Sampayoga sheet, Exclusivity and Co-Arising Rules',
				text: 'Compassion and sympathetic joy never co-arise. No being is presented to one citta as both suffering and happy. Their absence from the path and fruition follows from the same point: those cittas take Nibbāna.'
			},
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'Non-hatred is ease with what is met, most fully loving-kindness, and it does not require the object to be suffering or happy. Compassion wishes suffering to end; its near enemy is sentimental grief. Sympathetic joy is glad at another’s happiness. Equanimity holds the factors in even balance. It is not a flat tone, and it is not indifference.'
			}
		],
		members: [
			{ id: 'adosa', tell: 'Goodwill toward whatever is met. In every beautiful moment, not only toward a person in pain or in luck.' },
			{ id: 'karuna', tell: 'A suffering being, and the wish that the suffering end. Optional. Not grief that sinks with them.' },
			{ id: 'mudita', tell: 'A happy being, and gladness at that. Optional. Cannot share its moment with compassion.' },
			{ id: 'tatramajjhattata', tell: 'Balance of the factors, "there in the middle." In every beautiful moment, not only when you feel nothing.' }
		],
		keywords: ['metta', 'compassion', 'mudita', 'equanimity', 'kindness', 'brahmavihara', 'karuna', 'adosa']
	},
	{
		id: 'neutral-and-equanimity',
		title: 'Neutral feeling and equanimity',
		lede: 'The sheets use "equanimity" for two different things. This is the mix-up that the English creates.',
		together: 'partial',
		togetherText:
			'Neutral feeling is a mode of vedanā. It occurs in unwholesome and rootless cittas. Among the eighty-one mundane cittas it outnumbers joy, forty-seven to thirty. On the 121 reckoning joy is larger, sixty-two to fifty-five. The equanimity cetasika, tatramajjhattatā, is only in the 59 beautiful cittas. A beautiful moment can have both: balanced factors, and a neutral tone. A dull moment can have the neutral tone and cannot have the cetasika. Hatred cannot have the neutral tone at all: displeasure occurs in exactly two cittas, both hatred-rooted.',
		quote: {
			text: 'On the 121 reckoning those eight are counted at all five jhānas, and joy is the larger class: sixty-two against fifty-five.',
			source: 'Citta sheet, Cross-Cutting Distinctions. Here "equanimity" means the neutral feeling.'
		},
		notes: [
			{
				kind: 'definition',
				source: 'Citta sheet and cetasika sheet',
				text: 'Upekkhā in the citta tables is a feeling-tone: neither pleasant nor unpleasant. Tatramajjhattatā is "there in the middle," the even balance of the mind and its factors, compared to a charioteer with well-trained horses. Same English word in the two sheets. Different factors. A flat, confused scroll through bad news is the feeling. Holding praise and blame without lurching is the cetasika, and only if the moment is actually beautiful.'
			}
		],
		members: [
			{
				id: 'vedana',
				tell: 'The tone. Neutral tone is upekkhā. It is in unwholesome moments, bare seeing, and beautiful moments alike.'
			},
			{
				id: 'tatramajjhattata',
				tell: 'Balance of a beautiful mind. The citta sheet’s equanimity is the neutral tone, a different factor.'
			}
		],
		keywords: ['equanimity', 'upekkha', 'neutral', 'tatramajjhattata', 'indifference', 'feeling']
	},
	{
		id: 'six-pairs',
		title: 'The six pairs that arrive together',
		lede: 'Twelve names, and they feel like six ways of saying "calm." A beautiful moment has all twelve.',
		together: 'jobs',
		togetherText:
			'All twelve are among the nineteen beautiful universals, so all twelve are in every one of the 59 beautiful cittas. They are not moods you swap. "Kāya" in these names means the group of mental factors, not the physical body. Each quality has a twin: one for the factors, one for consciousness itself.',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'Tranquillity quiets disturbance. Lightness lifts heaviness. Pliancy softens stiffness. Adaptability makes the mind fit for the work. Proficiency is healthy competence from practice. Rectitude is straightness, without a hidden angle. The sheet says what each removes. That is a description of the job. It is not a special exclusivity rule for each pair. They still cannot share a moment with unwholesome factors, and that is only the general split between beautiful and unwholesome cittas.'
			}
		],
		members: [
			{ id: 'kayapassaddhi', tell: 'Factors go quiet. The twin, cittapassaddhi, is the knowing going quiet.' },
			{ id: 'cittapassaddhi', tell: 'The knowing rests. Same quality as kāyapassaddhi, other side of the pair.' },
			{ id: 'kayalahuta', tell: 'Factors get buoyant, no longer sunk. Not the same as quiet.' },
			{ id: 'cittalahuta', tell: 'The knowing feels unburdened. Twin of lightness of the factors.' },
			{ id: 'kayamuduta', tell: 'Factors soften enough to look at what they were rigid about.' },
			{ id: 'cittamuduta', tell: 'The knowing itself becomes shapeable. Twin of pliancy of the factors.' },
			{ id: 'kayakammannata', tell: 'Factors are fit for the job, like refined gold. Not yet "skilled from long use."' },
			{ id: 'cittakammannata', tell: 'Consciousness can be applied and stay useful. Twin of adaptability.' },
			{ id: 'kayapagunnata', tell: 'Factors perform well, without weakness, from practice. Fit-to-try was the previous pair.' },
			{ id: 'cittapagunnata', tell: 'The knowing is at home in the work. Twin of proficiency.' },
			{ id: 'kayujjukata', tell: 'Factors drop the hidden angle. Straight, not merely calm.' },
			{ id: 'cittujjukata', tell: 'The knowing meets the object directly, not sidelong. Twin of rectitude.' }
		],
		drillIds: ['kayapassaddhi', 'kayalahuta', 'kayamuduta', 'kayakammannata', 'kayapagunnata', 'kayujjukata'],
		drillNote:
			'The drill asks which quality it is, on the side of the mental factors. Each one has a twin for consciousness itself: same quality, the knowing rather than its retinue.',
		keywords: [
			'tranquillity',
			'lightness',
			'pliancy',
			'adaptability',
			'proficiency',
			'rectitude',
			'passaddhi',
			'calm',
			'six pairs',
			'kaya',
			'citta'
		]
	},
	{
		id: 'three-abstinences',
		title: 'Right speech, right action, and right livelihood',
		lede: 'Three ways of declining. In ordinary life, the moment declines one.',
		together: 'partial',
		togetherText:
			'In a mundane wholesome citta, at most one abstinence arises, and often none, because most wholesome moments involve no refraining. In a path citta all three are present and fixed: the sheet says they are then the eradication of the capacity to transgress, not three separate occasions. Fruition fixes all three as well. They occur in 16 cittas: 8 great wholesome and 8 supramundane.',
		notes: [
			{
				kind: 'rule',
				source: 'Sampayoga sheet, Exclusivity and Co-Arising Rules',
				text: 'Abstention is an event with an occasion. Declining a lie is right speech. Declining a theft is right action. The occasions are distinct, so only one can occupy an ordinary wholesome citta. Each factor arises at the moment of restraint, not whenever you generally intend to behave.'
			}
		],
		members: [
			{ id: 'samma-vaca', tell: 'You decline false, harsh, divisive, or idle speech, in that moment.' },
			{ id: 'samma-kammanta', tell: 'You decline killing, stealing, or sexual misconduct, in that moment.' },
			{
				id: 'samma-ajiva',
				tell: 'You decline a living made from poisons, intoxicants, weapons, slaves, or animals for slaughter, in that moment.'
			}
		],
		keywords: ['right speech', 'right action', 'right livelihood', 'abstinence', 'virati', 'precepts']
	},
	{
		id: 'rapture-and-sympathetic-joy',
		title: 'Rapture and sympathetic joy',
		lede: 'Both get called joy. One is interest in an object. The other is gladness at someone else’s happiness.',
		together: 'partial',
		togetherText:
			'They can share a joyful beautiful moment: rapture is in the sense-sphere cittas with joy, and sympathetic joy can arise in the great wholesome and great functional cittas. Sympathetic joy is unfixed, so plenty of rapturous moments have no sympathetic joy. Sympathetic joy takes a happy being. Rapture can take the breath, a song, or a meditation object.',
		notes: [
			{
				kind: 'definition',
				source: 'Cetasika sheet',
				text: 'Rapture is delight and interest in the mind’s object, from a light thrill to a flood, and it is distinct from the pleasant feeling that accompanies it. Sympathetic joy is gladness at another’s happiness, success, and good fortune. The sheet says it is harder to cultivate than compassion, and that it opposes envy. That opposition is the sheet’s description of the job. Envy and sympathetic joy also cannot share a moment, because one is unwholesome and the other beautiful.'
			}
		],
		members: [
			{ id: 'piti', tell: 'The mind’s thrill in whatever object it has, including one with no person in it.' },
			{ id: 'mudita', tell: 'Glad specifically that someone else is happy or succeeding.' }
		],
		keywords: ['joy', 'rapture', 'sympathetic joy', 'piti', 'mudita', 'gladness', 'happiness']
	}
];

const factorIds = new Set(cetasikas.map((factor) => factor.id));
const confusionIds = new Set<string>();
for (const confusion of confusions) {
	if (confusionIds.has(confusion.id)) throw new Error(`Duplicate confusion ${confusion.id}`);
	confusionIds.add(confusion.id);
	if (confusion.members.length < 2) throw new Error(`${confusion.id} needs two members`);
	for (const member of confusion.members) {
		if (!factorIds.has(member.id)) throw new Error(`${confusion.id} names unknown factor ${member.id}`);
	}
	for (const id of confusion.drillIds ?? []) {
		if (!confusion.members.some((member) => member.id === id)) {
			throw new Error(`${confusion.id} drills ${id}, which is not a member`);
		}
	}
}

export function getConfusion(id: string): Confusion | undefined {
	return confusions.find((confusion) => confusion.id === id);
}

export function confusionsFor(factorId: string): Confusion[] {
	return confusions.filter((confusion) => confusion.members.some((member) => member.id === factorId));
}

export function confusionMatches(confusion: Confusion, query: string): boolean {
	const hay = [confusion.title, confusion.lede, confusion.togetherText, ...confusion.keywords].join('\n');
	return matchesWords(hay, queryWords(query));
}
