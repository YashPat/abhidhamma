import type { Cetasika, GroupId, Syllable } from './types';

function pronounce(
	parts: ReadonlyArray<readonly [string, string]>,
	stress: number[],
	ipa: string
): { syllables: Syllable[]; stress: number[]; ipa: string } {
	return {
		syllables: parts.map(([text, hint]) => ({ text, hint })),
		stress,
		ipa
	};
}

const universal = 'All 89 cittas.';
const beautiful19 = 'All 59 beautiful cittas. Fixed there.';

export const groupOrder: GroupId[] = ['universal', 'occasional', 'unwholesome', 'beautiful'];

export const cetasikas: Cetasika[] = [
	{
		id: 'phassa',
		pali: 'Phassa',
		gloss: 'Contact',
		group: 'universal',
		...pronounce(
			[
				['phas', "p'huhss"],
				['sa', 'suh']
			],
			[0],
			'/ˈpʰas.sa/'
		),
		trap: 'ph is a p with a puff of air, not the f in phone.',
		range: universal,
		example: {
			scene:
				'The kettle clicks off. Before the word "tea," and before any wish to get up, the sound meets hearing.',
			read: 'That meeting of ear, sound, and the consciousness that knows it is contact. It is not the physical click. The tone of the click is feeling, a different factor in the same moment.'
		},
		aliases: ['meeting', 'sense contact']
	},
	{
		id: 'vedana',
		pali: 'Vedanā',
		gloss: 'Feeling',
		group: 'universal',
		...pronounce(
			[
				['ve', 'vay'],
				['da', 'duh'],
				['nā', 'naa']
			],
			[0],
			'/ˈveː.da.naː/'
		),
		range: universal,
		example: {
			scene:
				'The shower is a little too hot. Before any thought about the landlord, there is an unpleasant tone.',
			read: 'That tone is feeling. It is not the annoyance, which would be hatred, and it is not the recognition "too hot," which is perception.'
		},
		misread:
			'Feeling here is pleasant, unpleasant, or neither. It is not emotion. Emotion is a later and thicker reaction.',
		aliases: ['feeling tone', 'vedana', 'pleasant', 'unpleasant', 'neutral tone']
	},
	{
		id: 'sanna',
		pali: 'Saññā',
		gloss: 'Perception',
		group: 'universal',
		...pronounce(
			[
				['sañ', 'suhny'],
				['ñā', 'nyaa']
			],
			[0],
			'/ˈsaɲ.ɲaː/'
		),
		trap: 'ñ is the ny in canyon. It is held here because it is doubled.',
		range: universal,
		example: {
			scene:
				'A shape in the doorway resolves into "my sister" before you have decided whether you are glad she is here.',
			read: 'That marking and labeling is perception. It matches the shape against memory. It is not mindfulness, which is a beautiful factor and is not present in every recognition.'
		},
		aliases: ['recognition', 'label', 'sanna', 'perception']
	},
	{
		id: 'cetana',
		pali: 'Cetanā',
		gloss: 'Intention',
		group: 'universal',
		...pronounce(
			[
				['ce', 'chay'],
				['ta', 'tuh'],
				['nā', 'naa']
			],
			[0],
			'/ˈt͡ʃeː.ta.naː/'
		),
		trap: 'c is the ch in church, without an extra puff of air.',
		range: universal,
		example: {
			scene: 'Your hand goes for the phone. Something in the mind gathers the moment into "check the message."',
			read: 'That organizing drive is intention. The cetasika sheet identifies it with kamma. It is present even in moments with no wish to act, and it is not the same as wanting the news to be good.'
		},
		aliases: ['kamma', 'volition', 'cetana']
	},
	{
		id: 'ekaggata',
		pali: 'Ekaggatā',
		gloss: 'One-pointedness',
		group: 'universal',
		...pronounce(
			[
				['e', 'ay'],
				['kag', 'kuhg'],
				['ga', 'guh'],
				['tā', 'taa']
			],
			[1],
			'/eːˈkag.ga.taː/'
		),
		range: universal,
		example: {
			scene:
				'For a second the whole mind is on the sentence you are typing, radio still on. In the next second it is scattered, and there is still one object rather than none.',
			read: 'That unifying on a single object is one-pointedness. It is weak in ordinary moments and strong when concentration is developed. It is not mindfulness, and a scattered moment still has it.'
		},
		misread:
			'One-pointedness is in scattered moments too, weakly. If it were missing, there would be no cognition left. Concentration is this factor developed, not a different factor.',
		aliases: ['concentration', 'one-pointedness', 'ekaggata', 'samadhi']
	},
	{
		id: 'jivitindriya',
		pali: 'Jīvitindriya',
		gloss: 'Life faculty',
		group: 'universal',
		...pronounce(
			[
				['jī', 'jee'],
				['vi', 'vi'],
				['tin', 'tin'],
				['dri', 'dri'],
				['ya', 'yuh']
			],
			[2],
			'/d͡ʒiː.ʋiˈtin.dri.ja/'
		),
		range: universal,
		example: {
			scene:
				'Irritation is underway. Whatever else is true of it, the factors of that moment are kept present for as long as the moment lasts.',
			read: 'That maintaining is the life faculty. The sheet calls it the mental counterpart of the life faculty in the body. It is not how tired or energetic you feel.'
		},
		misread:
			'This is not vitality in the sense of how alive you feel. It sustains the other factors for this one moment, and it is in every moment, tired or not.',
		aliases: ['life faculty', 'vitality', 'jivitindriya']
	},
	{
		id: 'manasikara',
		pali: 'Manasikāra',
		gloss: 'Attention',
		group: 'universal',
		...pronounce(
			[
				['ma', 'muh'],
				['na', 'nuh'],
				['si', 'si'],
				['kā', 'kaa'],
				['ra', 'ruh']
			],
			[3],
			'/ma.na.siˈkaː.ra/'
		),
		range: universal,
		example: {
			scene: 'In a loud café the mind swings onto one voice and the rest drops into the background.',
			read: 'That steering onto an object is attention. It selects what contact then meets. It has not labeled the voice, and it is not the mindfulness that only beautiful moments have.'
		},
		aliases: ['attention', 'manasikara', 'wise attention']
	},
	{
		id: 'vitakka',
		pali: 'Vitakka',
		gloss: 'Initial application',
		group: 'occasional',
		...pronounce(
			[
				['vi', 'vi'],
				['tak', 'tuhk'],
				['ka', 'kuh']
			],
			[1],
			'/ʋiˈtak.ka/'
		),
		range:
			'55 cittas: 44 sense-sphere cittas (all 54 except the ten sense consciousnesses) plus 11 first-jhāna cittas.',
		example: {
			scene:
				'You sit down and the mind first throws itself onto the breath, the way the sheet’s bee flies at a flower.',
			read: 'That initial directing onto the object is initial application. Ordinary thinking depends on it. The factor is the throw, not the commentary that follows.'
		},
		misread:
			'It is easy to hear this as thinking in sentences. The sheet says it directs consciousness onto the object. Discursive thought depends on it and is not it.',
		aliases: ['initial application', 'thinking', 'vitakka']
	},
	{
		id: 'vicara',
		pali: 'Vicāra',
		gloss: 'Sustained application',
		group: 'occasional',
		...pronounce(
			[
				['vi', 'vi'],
				['cā', 'chaa'],
				['ra', 'ruh']
			],
			[1],
			'/ʋiˈt͡ʃaː.ra/'
		),
		trap: 'c is the ch in church.',
		range: '66 cittas: the 55 that have initial application, plus 11 second-jhāna cittas. The figure is the jhāna-wise one.',
		example: {
			scene:
				'The mind has landed on the breath and keeps circling there: the length of it, the texture, the end of the exhale.',
			read: 'That continued rubbing is sustained application. Where initial application strikes, this keeps the mind on the object. In the jhānas, initial application drops at the second and this can remain.'
		},
		aliases: ['sustained application', 'vicara', 'examining']
	},
	{
		id: 'adhimokkha',
		pali: 'Adhimokkha',
		gloss: 'Determination',
		group: 'occasional',
		...pronounce(
			[
				['a', 'uh'],
				['dhi', "d'hi"],
				['mok', 'mok'],
				['kha', "k'huh"]
			],
			[2],
			'/a.dʰiˈmok.kʰa/'
		),
		trap: 'dh is a d with a puff of air. kh is a k with a puff of air.',
		range: '78 cittas. Absent from the ten sense consciousnesses and from the one doubt-rooted citta.',
		example: {
			scene: 'Two replies are possible. Then the mind sets: the short one. The wavering is gone.',
			read: 'That setting is determination. The sheet compares it to a stone pillar. The doubt-rooted citta has none, because deciding and wavering exclude each other.'
		},
		aliases: ['decision', 'determination', 'adhimokkha']
	},
	{
		id: 'viriya',
		pali: 'Viriya',
		gloss: 'Energy',
		group: 'occasional',
		...pronounce(
			[
				['vi', 'vi'],
				['ri', 'ri'],
				['ya', 'yuh']
			],
			[0],
			'/ˈʋi.ri.ja/'
		),
		range:
			'73 cittas. Absent from sixteen rootless cittas: all eighteen rootless except mind-door adverting and the smile-producer.',
		example: {
			scene: 'The paragraph is dull and you keep going, not because it got interesting, but because effort is being fed in.',
			read: 'That mustering of effort is energy. It can serve a kind aim or a cruel one. It is not the scattered feeling of restlessness, and it is not the life faculty that every moment already has.'
		},
		aliases: ['effort', 'energy', 'viriya']
	},
	{
		id: 'piti',
		pali: 'Pīti',
		gloss: 'Rapture',
		group: 'occasional',
		...pronounce(
			[
				['pī', 'pee'],
				['ti', 'ti']
			],
			[0],
			'/ˈpiː.ti/'
		),
		range:
			'51 cittas, counted jhāna-wise: 18 sense-sphere cittas with joy, plus 33 cittas of the first three jhānas. Missing wherever feeling is not joyful, and missing from the fourth jhāna too.',
		example: {
			scene:
				'A song you love comes on and the mind lights up — interest, a thrill — before you would call the body comfortable.',
			read: 'That refreshment is rapture. A pleasant tone that comes with it is feeling, a different factor. The fourth jhāna keeps a pleasant feeling and has let rapture go.'
		},
		misread:
			'Rapture is not the pleasant feeling itself. Interest and thrill are this factor. The pleasant tone beside them is feeling.',
		aliases: ['rapture', 'joy', 'piti', 'delight', 'thrill']
	},
	{
		id: 'chanda',
		pali: 'Chanda',
		gloss: 'Wish',
		group: 'occasional',
		...pronounce(
			[
				['chan', "ch'uhn"],
				['da', 'duh']
			],
			[0],
			'/ˈt͡ʃʰan.da/'
		),
		trap: 'ch is the ch in church plus a puff of air.',
		range: '69 cittas. Absent from the eighteen rootless and the two delusion-rooted.',
		example: {
			scene:
				'"I am going to answer that email." Not the image of being admired for answering it. Just the wish to do the act.',
			read: 'That desire to act is wish. The sheet says it can be present together with craving, or it can be the aspiration for liberation. Greed is the sticking. Wish is the inclination to act, and a merely confused moment has none.'
		},
		misread:
			'Wish is not a mild version of greed. It can keep company with craving, or be the aspiration for liberation. The ethical character comes from the company it keeps.',
		aliases: ['desire to act', 'wish', 'chanda', 'aspiration']
	},
	{
		id: 'moha',
		pali: 'Moha',
		gloss: 'Delusion',
		group: 'unwholesome',
		...pronounce(
			[
				['mo', 'moh'],
				['ha', 'huh']
			],
			[0],
			'/ˈmoː.ha/'
		),
		range: 'All 12 unwholesome cittas.',
		example: {
			scene:
				'The silence in the thread means they are angry. It does not occur to you that the silence might mean they are in a meeting.',
			read: 'That not-seeing is delusion. It is in every unwholesome moment, including ones that feel sharp and ones that already hold a view about a self. It is not that view, and it is not the stall of doubt.'
		},
		aliases: ['delusion', 'ignorance', 'moha', 'confusion']
	},
	{
		id: 'ahirika',
		pali: 'Ahirika',
		gloss: 'Shamelessness',
		group: 'unwholesome',
		...pronounce(
			[
				['a', 'uh'],
				['hi', 'hi'],
				['ri', 'ri'],
				['ka', 'kuh']
			],
			[1],
			'/aˈhi.ri.ka/'
		),
		range: 'All 12 unwholesome cittas.',
		example: {
			scene:
				'You are about to forward a private message to make someone look bad, and nothing in you says this is beneath you.',
			read: 'That missing inner recoil is shamelessness. It is in every unwholesome moment. It is not the same as ignoring the consequences.'
		},
		aliases: ['shamelessness', 'ahirika', 'no shame']
	},
	{
		id: 'anottappa',
		pali: 'Anottappa',
		gloss: 'Moral fearlessness',
		group: 'unwholesome',
		...pronounce(
			[
				['a', 'uh'],
				['not', 'not'],
				['tap', 'tuhp'],
				['pa', 'puh']
			],
			[2],
			'/a.notˈtap.pa/'
		),
		range: 'All 12 unwholesome cittas.',
		example: {
			scene: 'You know the forwarded message will land badly, and you send it anyway.',
			read: 'That recklessness about consequence — blame from others, or the ripening of kamma — is moral fearlessness. The sheet compares it to grasping a hot coal. Shamelessness is the missing inward recoil. This is the missing dread of what follows.'
		},
		aliases: ['fearlessness', 'recklessness', 'anottappa']
	},
	{
		id: 'uddhacca',
		pali: 'Uddhacca',
		gloss: 'Restlessness',
		group: 'unwholesome',
		...pronounce(
			[
				['u', 'u'],
				['ddhac', "d'duhch"],
				['ca', 'chuh']
			],
			[1],
			'/udˈdʰat.t͡ʃa/'
		),
		trap: 'dh is a d with a puff of air. The c is ch as in church.',
		range: 'All 12 unwholesome cittas.',
		example: {
			scene:
				'You sit to read and the mind skitters: another tab, a memory, the thing you forgot. Nothing in particular is being regretted.',
			read: 'That scattering is restlessness. It is in every unwholesome moment, including pleasant greedy ones. Worry about a deed already done is a different factor, and it is not in every unwholesome moment.'
		},
		aliases: ['restlessness', 'agitation', 'uddhacca', 'scattered']
	},
	{
		id: 'lobha',
		pali: 'Lobha',
		gloss: 'Greed',
		group: 'unwholesome',
		...pronounce(
			[
				['lo', 'loh'],
				['bha', "b'huh"]
			],
			[0],
			'/ˈloː.bʰa/'
		),
		trap: 'bh is a b with a puff of air, not a v.',
		range: 'The 8 greed-rooted cittas.',
		example: {
			scene: 'The role is announced and the mind sticks to "that should be mine."',
			read: 'That sticking is greed, from mild attraction to open craving. A wish to do the work, with no holding on, would be wish instead. Ranking yourself against the person who got the role would be conceit, and that may be absent from this moment.'
		},
		aliases: ['greed', 'craving', 'clinging', 'lobha', 'attachment']
	},
	{
		id: 'ditthi',
		pali: 'Diṭṭhi',
		gloss: 'Wrong view',
		group: 'unwholesome',
		...pronounce(
			[
				['diṭ', 'dit'],
				['ṭhi', "t'hi"]
			],
			[0],
			'/ˈdiʈ.ʈʰi/'
		),
		trap: 'ṭ is a t made with the tongue curled back. ṭh adds a puff of air.',
		range: 'The 4 greed-rooted cittas associated with wrong view. Fixed in those.',
		example: {
			scene:
				'"I was passed over because I am the kind of person who never gets chosen." The mind settles that as the truth about a self.',
			read: 'That confident mis-seeing is wrong view. The sheet says it is worse than plain not-seeing because it interprets and is convinced. It cannot share a moment with conceit.'
		},
		aliases: ['wrong view', 'ditthi', 'view', 'dogma']
	},
	{
		id: 'mana',
		pali: 'Māna',
		gloss: 'Conceit',
		group: 'unwholesome',
		...pronounce(
			[
				['mā', 'maa'],
				['na', 'nuh']
			],
			[0],
			'/ˈmaː.na/'
		),
		range:
			'The 4 greed-rooted cittas dissociated from wrong view. Unfixed even there, so most greedy moments have no conceit.',
		example: {
			scene:
				'They got the role, and the mind ranks you against them: better than them and robbed, or worse and confirmed.',
			read: 'That measuring is conceit. Better, equal, and worse are all conceit, because each needs a self to place on a scale. It is not the dogma "this is who I am," and the two never arise together.'
		},
		aliases: ['conceit', 'pride', 'comparison', 'mana', 'inferiority', 'superiority']
	},
	{
		id: 'dosa',
		pali: 'Dosa',
		gloss: 'Hatred',
		group: 'unwholesome',
		...pronounce(
			[
				['do', 'doh'],
				['sa', 'suh']
			],
			[0],
			'/ˈdoː.sa/'
		),
		range: 'The 2 hatred-rooted cittas.',
		example: {
			scene: 'The short message lands and something in the mind strikes back. You want them to feel it.',
			read: 'That striking is hatred. Irritation, resentment, cruelty, and the flinch of fear are forms of it. It cannot share a moment with greed. The unpleasant tone alongside it is feeling. Bodily pain, as in a stubbed toe, is also feeling, and that moment has no hatred in it.'
		},
		misread:
			'Fear that flinches from a threat is classed here, as striking against an object. Moral fear of the consequences of your own wrongdoing is ottappa, a beautiful factor, and the two cannot share a moment.',
		aliases: ['hatred', 'anger', 'aversion', 'irritation', 'resentment', 'dosa', 'fear']
	},
	{
		id: 'issa',
		pali: 'Issā',
		gloss: 'Envy',
		group: 'unwholesome',
		...pronounce(
			[
				['is', 'iss'],
				['sā', 'saa']
			],
			[0],
			'/ˈis.saː/'
		),
		trap: 'Hold the double s. The second vowel is long.',
		range:
			'Only within the 2 hatred-rooted cittas, and at most one of envy, stinginess, and remorse in a given moment. Unfixed: a hatred moment need not have it.',
		example: {
			scene: 'Their launch post does well and you cannot bear that it is going well for them.',
			read: 'That inability to stand their good fortune is envy. The object is their success. Stinginess instead contracts around what is yours, and the two cannot share a moment.'
		},
		aliases: ['envy', 'jealousy', 'issa']
	},
	{
		id: 'macchariya',
		pali: 'Macchariya',
		gloss: 'Stinginess',
		group: 'unwholesome',
		...pronounce(
			[
				['mac', 'muhch'],
				['cha', "ch'uh"],
				['ri', 'ri'],
				['ya', 'yuh']
			],
			[0],
			'/ˈmat.t͡ʃʰa.ri.ja/'
		),
		trap: 'The ch is ch plus a puff of air.',
		range:
			'Only within the 2 hatred-rooted cittas, and at most one of envy, stinginess, and remorse in a given moment. Unfixed.',
		example: {
			scene: 'A teammate asks how you got the query to run, and you blur the answer so they cannot do it too.',
			read: 'That withholding of what is yours — skill, credit, a possession — is stinginess. Envy grudges what they have. This grudges what they might get from you.'
		},
		aliases: ['stinginess', 'avarice', 'withholding', 'macchariya', 'possessiveness']
	},
	{
		id: 'kukkucca',
		pali: 'Kukkucca',
		gloss: 'Worry, remorse',
		group: 'unwholesome',
		...pronounce(
			[
				['kuk', 'kuk'],
				['kuc', 'kuch'],
				['ca', 'chuh']
			],
			[1],
			'/kukˈkut.t͡ʃa/'
		),
		trap: 'Both vowels are the u in put, not the oo in food. c is ch.',
		range:
			'Only within the 2 hatred-rooted cittas, and at most one of envy, stinginess, and remorse in a given moment. Unfixed.',
		example: {
			scene:
				'You were short with them. An hour later the mind is still gnawing on "I should not have said that," with no move to repair, only the churn.',
			read: 'That fret over a deed done or omitted is remorse. Restlessness can skitter with no particular deed in mind. This factor takes your own past conduct as its object.'
		},
		aliases: ['worry', 'remorse', 'guilt', 'regret', 'kukkucca', 'anxiety']
	},
	{
		id: 'thina',
		pali: 'Thīna',
		gloss: 'Sloth',
		group: 'unwholesome',
		...pronounce(
			[
				['thī', "t'hee"],
				['na', 'nuh']
			],
			[0],
			'/ˈtʰiː.na/'
		),
		trap: 'th is a t with a puff of air, not the th in think.',
		range: 'The 5 prompted unwholesome cittas. Unfixed. The sheet presents it together with torpor.',
		example: {
			scene:
				'You know the next sentence, and the knowing itself goes limp, while you are still sitting upright.',
			read: 'That sluggishness of consciousness is sloth. The heaviness of the other factors is torpor. This is not simply "low energy." It belongs to prompted unwholesome moments.'
		},
		aliases: ['sloth', 'laziness', 'thina', 'lethargy']
	},
	{
		id: 'middha',
		pali: 'Middha',
		gloss: 'Torpor',
		group: 'unwholesome',
		...pronounce(
			[
				['mid', 'mid'],
				['dha', "d'huh"]
			],
			[0],
			'/ˈmid.dʰa/'
		),
		trap: 'dh is a d with a puff of air.',
		range: 'The 5 prompted unwholesome cittas. Unfixed. The sheet presents it together with sloth.',
		example: {
			scene:
				'With that limpness, everything that came along with the mind goes thick: the label fuzzy, the effort unavailable, the moment sinking.',
			read: 'That heaviness of the accompanying factors is torpor. Sloth afflicts the consciousness. Torpor afflicts its retinue.'
		},
		aliases: ['torpor', 'dullness', 'drowsiness', 'middha', 'sleepiness']
	},
	{
		id: 'vicikiccha',
		pali: 'Vicikicchā',
		gloss: 'Sceptical doubt',
		group: 'unwholesome',
		...pronounce(
			[
				['vi', 'vi'],
				['ci', 'chi'],
				['kic', 'kich'],
				['chā', "ch'aa"]
			],
			[2],
			'/ʋi.t͡ʃiˈkit.t͡ʃʰaː/'
		),
		trap: 'The last cluster, cch, is ch with a puff of air.',
		range: '1 citta: the delusion-rooted citta accompanied by doubt.',
		example: {
			scene:
				'You are at the cushion and will not commit. "Is this pointless? Did I pick the wrong method?" You do not then investigate. You stall.',
			read: 'That paralysis is doubt. The sheet compares it to a traveller stopped at a fork, and says it is not honest inquiry. Determination is absent from this one citta.'
		},
		aliases: ['doubt', 'scepticism', 'skepticism', 'vicikiccha', 'indecision']
	},
	{
		id: 'saddha',
		pali: 'Saddhā',
		gloss: 'Confidence',
		group: 'beautiful',
		...pronounce(
			[
				['sad', 'suhd'],
				['dhā', "d'haa"]
			],
			[0],
			'/ˈsad.dʰaː/'
		),
		trap: 'dh is a d with a puff of air. The second vowel is long.',
		range: beautiful19,
		example: {
			scene:
				'The paragraph is hard. You do not yet understand it, and you still trust that staying with it is worth doing. The mind clears enough to look.',
			read: 'That trust, placed in something worthy of it, is confidence. The sheet compares it to a gem that settles muddy water, and says it is not blind belief.'
		},
		aliases: ['faith', 'confidence', 'trust', 'saddha']
	},
	{
		id: 'sati',
		pali: 'Sati',
		gloss: 'Mindfulness',
		group: 'beautiful',
		...pronounce(
			[
				['sa', 'suh'],
				['ti', 'ti']
			],
			[0],
			'/ˈsa.ti/'
		),
		range: beautiful19,
		example: {
			scene:
				'Anger starts, and you know "anger is here," without floating off into the speech you are going to give them.',
			read: 'That non-skimming remembering is mindfulness. It is only in beautiful moments. Steering onto an object happens in angry moments too, and that factor is attention, not this.'
		},
		misread:
			'Mindfulness is not noticing in general. Unwholesome moments notice their objects too, and what they have is attention and perception, not mindfulness.',
		aliases: ['mindfulness', 'sati', 'remembering', 'presence']
	},
	{
		id: 'hiri',
		pali: 'Hiri',
		gloss: 'Moral shame',
		group: 'beautiful',
		...pronounce(
			[
				['hi', 'hi'],
				['ri', 'ri']
			],
			[0],
			'/ˈhi.ri/'
		),
		range: beautiful19,
		example: {
			scene: 'The cruel reply is typed. What stops the send is: this is beneath me.',
			read: 'That inner recoil, grounded in self-respect, is moral shame. It looks inward. It arises together with moral fear in every beautiful moment. The two are not alternatives.'
		},
		aliases: ['shame', 'conscience', 'hiri', 'self-respect']
	},
	{
		id: 'ottappa',
		pali: 'Ottappa',
		gloss: 'Moral fear',
		group: 'beautiful',
		...pronounce(
			[
				['ot', 'ot'],
				['tap', 'tuhp'],
				['pa', 'puh']
			],
			[1],
			'/otˈtap.pa/'
		),
		range: beautiful19,
		example: {
			scene: 'The same cruel reply, and what stops you is the harm they would carry, and the kamma you would make.',
			read: 'That dread of consequence is moral fear. It looks outward. It is not the flinch of being afraid of someone, which falls under hatred.'
		},
		aliases: ['moral dread', 'ottappa', 'fear of wrongdoing', 'conscience']
	},
	{
		id: 'alobha',
		pali: 'Alobha',
		gloss: 'Non-greed',
		group: 'beautiful',
		...pronounce(
			[
				['a', 'uh'],
				['lo', 'loh'],
				['bha', "b'huh"]
			],
			[1],
			'/aˈloː.bʰa/'
		),
		trap: 'bh is a b with a puff of air, not a v.',
		range: beautiful19,
		example: {
			scene: 'The last piece of cake is there. The mind does not stick. You slide the plate over.',
			read: 'That openhandedness is non-greed. The sheet compares it to a water drop on a lotus leaf. It is not indifference, and it is not the same as wishing the other person well.'
		},
		aliases: ['non-greed', 'generosity', 'renunciation', 'alobha', 'letting go']
	},
	{
		id: 'adosa',
		pali: 'Adosa',
		gloss: 'Non-hatred',
		group: 'beautiful',
		...pronounce(
			[
				['a', 'uh'],
				['do', 'doh'],
				['sa', 'suh']
			],
			[1],
			'/aˈdoː.sa/'
		),
		range: beautiful19,
		example: {
			scene:
				'The curt message arrives and, for this moment, nothing strikes back. There is room for the person who sent it.',
			read: 'That ease is non-hatred. The sheet says it appears most fully as loving-kindness. Wishing their suffering to end would be compassion. Being glad they are happy would be sympathetic joy. Those two are not in every beautiful moment. This one is.'
		},
		misread:
			'Non-hatred is not a blank absence of anger. The sheet says it appears most fully as loving-kindness: the mind at ease with what it meets.',
		aliases: ['non-hatred', 'metta', 'loving-kindness', 'goodwill', 'adosa', 'kindness']
	},
	{
		id: 'tatramajjhattata',
		pali: 'Tatramajjhattatā',
		gloss: 'Equanimity',
		group: 'beautiful',
		...pronounce(
			[
				['tat', 'tuht'],
				['ra', 'ruh'],
				['maj', 'muhj'],
				['jhat', "j'huht"],
				['ta', 'tuh'],
				['tā', 'taa']
			],
			[3],
			'/tat.ra.madˈd͡ʒʰat.ta.taː/'
		),
		trap: 'jh is a j with a puff of air. The name is long; the stressed syllable is jhat.',
		range: beautiful19,
		example: {
			scene:
				'Praise in one conversation, criticism in the next, and the mind holds both without excess in either direction.',
			read: 'That balance of the mind and its factors is equanimity, literally "there in the middle." It is not a flat feeling-tone. Neutral feeling is common in unwholesome moments. This factor is only in beautiful ones.'
		},
		misread:
			'The citta sheet uses "equanimity" for neutral feeling and calls it the most common feeling in the system. This factor is the balance of a beautiful mind. A merely neutral moment does not have it.',
		aliases: ['equanimity', 'balance', 'tatramajjhattata', 'upekkha']
	},
	{
		id: 'kayapassaddhi',
		pali: 'Kāyapassaddhi',
		gloss: 'Tranquillity of mental factors',
		group: 'beautiful',
		...pronounce(
			[
				['kā', 'kaa'],
				['ya', 'yuh'],
				['pas', 'puhs'],
				['sad', 'suhd'],
				['dhi', "d'hi"]
			],
			[3],
			'/kaː.ja.pasˈsad.dʰi/'
		),
		trap: 'The final dh is a d with a puff of air, not the th in this.',
		range: beautiful19,
		example: {
			scene:
				'After the argument, the urge to rehearse it loosens. Feeling, perception, and effort stop buzzing. What quiets is that group of factors.',
			read: 'That quieting of the mental factors is tranquillity of the factors. "Kāya" here means the group of mental factors, not the physical body. The knowing itself going quiet is the twin factor.'
		},
		aliases: ['tranquillity', 'tranquility', 'calm', 'passaddhi', 'kayapassaddhi']
	},
	{
		id: 'cittapassaddhi',
		pali: 'Cittapassaddhi',
		gloss: 'Tranquillity of consciousness',
		group: 'beautiful',
		...pronounce(
			[
				['cit', 'chit'],
				['ta', 'tuh'],
				['pas', 'puhs'],
				['sad', 'suhd'],
				['dhi', "d'hi"]
			],
			[3],
			'/t͡ʃit.ta.pasˈsad.dʰi/'
		),
		trap: 'c is ch. The final dh is a d with a puff of air.',
		range: beautiful19,
		example: {
			scene:
				'In the same stretch after the argument, it is the knowing that stops thrashing. The mind that knows rests.',
			read: 'That is tranquillity of consciousness. The sheet compares the pair to shade and coolness in a hot place. Both are in every beautiful moment.'
		},
		aliases: ['tranquillity of mind', 'cittapassaddhi']
	},
	{
		id: 'kayalahuta',
		pali: 'Kāyalahutā',
		gloss: 'Lightness of mental factors',
		group: 'beautiful',
		...pronounce(
			[
				['kā', 'kaa'],
				['ya', 'yuh'],
				['la', 'luh'],
				['hu', 'hu'],
				['tā', 'taa']
			],
			[0],
			'/ˈkaː.ja.la.hu.taː/'
		),
		range: beautiful19,
		example: {
			scene: 'Sitting down to practice stops feeling like lifting a heavy coat. The factors are quick instead of sunk.',
			read: 'That buoyancy of the factors is lightness. Its job stands against the heaviness of sloth and torpor. It is not the same as the quieting of tranquillity.'
		},
		aliases: ['lightness', 'buoyancy', 'lahuta', 'kayalahuta']
	},
	{
		id: 'cittalahuta',
		pali: 'Cittalahutā',
		gloss: 'Lightness of consciousness',
		group: 'beautiful',
		...pronounce(
			[
				['cit', 'chit'],
				['ta', 'tuh'],
				['la', 'luh'],
				['hu', 'hu'],
				['tā', 'taa']
			],
			[0],
			'/ˈt͡ʃit.ta.la.hu.taː/'
		),
		trap: 'c is ch.',
		range: beautiful19,
		example: {
			scene:
				'The knowing itself feels unburdened, as if a pack came off. It can move to the next thing without dragging.',
			read: 'That is lightness of consciousness. Same quality as its twin, on the side of the knowing rather than the factors.'
		},
		aliases: ['lightness of mind', 'cittalahuta']
	},
	{
		id: 'kayamuduta',
		pali: 'Kāyamudutā',
		gloss: 'Pliancy of mental factors',
		group: 'beautiful',
		...pronounce(
			[
				['kā', 'kaa'],
				['ya', 'yuh'],
				['mu', 'mu'],
				['du', 'du'],
				['tā', 'taa']
			],
			[0],
			'/ˈkaː.ja.mu.du.taː/'
		),
		range: beautiful19,
		example: {
			scene:
				'You have been sure you are right, and the factors soften enough that the other side of the story can actually be looked at.',
			read: 'That malleability of the factors is pliancy. The sheet says it removes the stiffness of wrong view and conceit. Soft is not the same as quiet, and not the same as merely being fit for the job.'
		},
		aliases: ['pliancy', 'softness', 'muduta', 'kayamuduta', 'flexibility']
	},
	{
		id: 'cittamuduta',
		pali: 'Cittamudutā',
		gloss: 'Pliancy of consciousness',
		group: 'beautiful',
		...pronounce(
			[
				['cit', 'chit'],
				['ta', 'tuh'],
				['mu', 'mu'],
				['du', 'du'],
				['tā', 'taa']
			],
			[0],
			'/ˈt͡ʃit.ta.mu.du.taː/'
		),
		trap: 'c is ch.',
		range: beautiful19,
		example: {
			scene: 'The knowing itself can be pointed at their side of the story, and it goes. It is shapeable.',
			read: 'That is pliancy of consciousness. The sheet says a hardened mind cannot learn, and a pliant one can.'
		},
		aliases: ['pliancy of mind', 'cittamuduta']
	},
	{
		id: 'kayakammannata',
		pali: 'Kāyakammaññatā',
		gloss: 'Adaptability of mental factors',
		group: 'beautiful',
		...pronounce(
			[
				['kā', 'kaa'],
				['ya', 'yuh'],
				['kam', 'kuhm'],
				['mañ', 'muhny'],
				['ña', 'nyuh'],
				['tā', 'taa']
			],
			[3],
			'/kaː.ja.kamˈmaɲ.ɲa.taː/'
		),
		trap: 'ñ is the ny in canyon, and it is held.',
		range: beautiful19,
		example: {
			scene:
				'The meditation instruction can actually be carried out. Attention stays, effort is the right amount, the factors are fit for the job.',
			read: 'That fitness is adaptability of the mental factors. The sheet compares it to gold refined enough for the smith. Being skilled from long practice is proficiency, the next pair.'
		},
		aliases: ['adaptability', 'workability', 'wieldiness', 'kammannata', 'kayakammannata']
	},
	{
		id: 'cittakammannata',
		pali: 'Cittakammaññatā',
		gloss: 'Adaptability of consciousness',
		group: 'beautiful',
		...pronounce(
			[
				['cit', 'chit'],
				['ta', 'tuh'],
				['kam', 'kuhm'],
				['mañ', 'muhny'],
				['ña', 'nyuh'],
				['tā', 'taa']
			],
			[3],
			'/t͡ʃit.ta.kamˈmaɲ.ɲa.taː/'
		),
		trap: 'c is ch. ñ is ny, and it is held.',
		range: beautiful19,
		example: {
			scene: 'Consciousness itself takes the meditation object and stays useful there, instead of resisting every instruction.',
			read: 'That is adaptability of consciousness. The mind has become an instrument for the work rather than an obstacle to it.'
		},
		aliases: ['workability of mind', 'cittakammannata']
	},
	{
		id: 'kayapagunnata',
		pali: 'Kāyapāguññatā',
		gloss: 'Proficiency of mental factors',
		group: 'beautiful',
		...pronounce(
			[
				['kā', 'kaa'],
				['ya', 'yuh'],
				['pā', 'paa'],
				['guñ', 'guny'],
				['ña', 'nyuh'],
				['tā', 'taa']
			],
			[3],
			'/kaː.ja.paːˈguɲ.ɲa.taː/'
		),
		trap: 'ñ is ny. The u in guñ is the vowel in put.',
		range: beautiful19,
		example: {
			scene:
				'You have sat with this kind of agitation many times. Mindfulness does not slip into a lecture, and effort does not spike. The factors perform without weakness.',
			read: 'That healthy competence of the factors is proficiency. The sheet says it removes the faithlessness and hesitancy that make the mind falter. Being fit to try is adaptability. Performing well from practice is this.'
		},
		aliases: ['proficiency', 'skill', 'pagunnata', 'kayapagunnata']
	},
	{
		id: 'cittapagunnata',
		pali: 'Cittapāguññatā',
		gloss: 'Proficiency of consciousness',
		group: 'beautiful',
		...pronounce(
			[
				['cit', 'chit'],
				['ta', 'tuh'],
				['pā', 'paa'],
				['guñ', 'guny'],
				['ña', 'nyuh'],
				['tā', 'taa']
			],
			[3],
			'/t͡ʃit.ta.paːˈguɲ.ɲa.taː/'
		),
		trap: 'c is ch. ñ is ny.',
		range: beautiful19,
		example: {
			scene: 'The knowing itself is sure and steady. You are at home in the practice rather than wrestling it.',
			read: 'That is proficiency of consciousness. The sheet compares it to a craft no longer fumbled.'
		},
		aliases: ['proficiency of mind', 'cittapagunnata']
	},
	{
		id: 'kayujjukata',
		pali: 'Kāyujjukatā',
		gloss: 'Rectitude of mental factors',
		group: 'beautiful',
		...pronounce(
			[
				['kā', 'kaa'],
				['yuj', 'yuj'],
				['ju', 'ju'],
				['ka', 'kuh'],
				['tā', 'taa']
			],
			[1],
			'/kaːˈjud.d͡ʒu.ka.taː/'
		),
		range: beautiful19,
		example: {
			scene:
				'You notice you were about to tell the story so that you come out well, and you drop the angle. The account matches what happened.',
			read: 'That straightness of the factors is rectitude. The sheet says it removes the twist that hypocrisy and a hidden agenda introduce. It is not the same as merely being calm.'
		},
		aliases: ['rectitude', 'honesty', 'uprightness', 'ujjukata', 'kayujjukata']
	},
	{
		id: 'cittujjukata',
		pali: 'Cittujjukatā',
		gloss: 'Rectitude of consciousness',
		group: 'beautiful',
		...pronounce(
			[
				['cit', 'chit'],
				['tuj', 'tuj'],
				['ju', 'ju'],
				['ka', 'kuh'],
				['tā', 'taa']
			],
			[1],
			'/t͡ʃitˈtud.d͡ʒu.ka.taː/'
		),
		trap: 'c is ch. Both u vowels are as in put.',
		range: beautiful19,
		example: {
			scene: 'Consciousness meets what happened directly, instead of sidelong, managing how it will look.',
			read: 'That is rectitude of consciousness. The sheet says a crooked mind cannot see clearly, because it is busy managing appearances.'
		},
		aliases: ['rectitude of mind', 'cittujjukata']
	},
	{
		id: 'samma-vaca',
		pali: 'Sammā vācā',
		gloss: 'Right speech',
		group: 'beautiful',
		...pronounce(
			[
				['sam', 'suhm'],
				['mā', 'maa'],
				['vā', 'vaa'],
				['cā', 'chaa']
			],
			[0, 2],
			'/ˈsam.maː ˈʋaː.t͡ʃaː/'
		),
		trap: 'c is ch. Each word has its own stress.',
		range:
			'16 cittas: the 8 great wholesome and the 8 supramundane. In an ordinary wholesome moment, at most one abstinence, and often none. In the supramundane, all three are present and fixed.',
		example: {
			scene: 'The exaggerated version of the story is right there, and you do not say it.',
			read: 'Right speech is that abstention, in the moment, from false, harsh, divisive, or idle speech. A general policy of being honest is not the factor. It arises while the declining is real.'
		},
		aliases: ['right speech', 'samma vaca', 'abstaining from speech']
	},
	{
		id: 'samma-kammanta',
		pali: 'Sammā kammanta',
		gloss: 'Right action',
		group: 'beautiful',
		...pronounce(
			[
				['sam', 'suhm'],
				['mā', 'maa'],
				['kam', 'kuhm'],
				['man', 'muhn'],
				['ta', 'tuh']
			],
			[0, 3],
			'/ˈsam.maː kamˈman.ta/'
		),
		range:
			'16 cittas: the 8 great wholesome and the 8 supramundane. In an ordinary wholesome moment, at most one abstinence, and often none. In the supramundane, all three are present and fixed.',
		example: {
			scene: 'A wallet sits open on the next table. Your hand stays where it is.',
			read: 'Right action is the abstention from taking what is not given — or from killing, or from sexual misconduct — at the moment you refrain. Declining a lie is a different factor. Declining a livelihood is a third.'
		},
		aliases: ['right action', 'samma kammanta']
	},
	{
		id: 'samma-ajiva',
		pali: 'Sammā ājīva',
		gloss: 'Right livelihood',
		group: 'beautiful',
		...pronounce(
			[
				['sam', 'suhm'],
				['mā', 'maa'],
				['ā', 'aa'],
				['jī', 'jee'],
				['va', 'vuh']
			],
			[0, 3],
			'/ˈsam.maː aːˈd͡ʒiː.ʋa/'
		),
		range:
			'16 cittas: the 8 great wholesome and the 8 supramundane. In an ordinary wholesome moment, at most one abstinence, and often none. In the supramundane, all three are present and fixed.',
		example: {
			scene: 'The contract pays well. It is for a weapons broker. You turn it down.',
			read: 'Right livelihood is that abstention, in the moment you turn the gain down. The sheet names trade in weapons, poisons, intoxicants, living beings, and deceit. A job you feel proud of is not, by itself, this factor.'
		},
		aliases: ['right livelihood', 'samma ajiva']
	},
	{
		id: 'karuna',
		pali: 'Karuṇā',
		gloss: 'Compassion',
		group: 'beautiful',
		...pronounce(
			[
				['ka', 'kuh'],
				['ru', 'ru'],
				['ṇā', 'naa']
			],
			[0],
			'/ˈka.ru.ɳaː/'
		),
		trap: 'ṇ is an n with the tongue curled back. The stress is on the first syllable; the last vowel is still long.',
		range:
			'28 cittas: 8 great wholesome, 8 great functional, and 12 fine-material cittas of the first four jhānas. Unfixed. Never together with sympathetic joy. Not in the supramundane.',
		example: {
			scene:
				'A friend is crying about the diagnosis. The mind moves toward their pain with the wish that it ease, and you can still help.',
			read: 'That is compassion. The sheet says its near enemy is sentimental grief, which shares the pain instead of easing it. The object is a suffering being. Gladness at their success cannot be in this same moment.'
		},
		aliases: ['compassion', 'karuna', 'pity']
	},
	{
		id: 'mudita',
		pali: 'Muditā',
		gloss: 'Sympathetic joy',
		group: 'beautiful',
		...pronounce(
			[
				['mu', 'mu'],
				['di', 'di'],
				['tā', 'taa']
			],
			[0],
			'/ˈmu.di.taː/'
		),
		range:
			'28 cittas: 8 great wholesome, 8 great functional, and 12 fine-material cittas of the first four jhānas. Unfixed. Never together with compassion. Not in the supramundane.',
		example: {
			scene: 'The friend who wanted the same job gets it, and for a moment you are glad it is going well for them.',
			read: 'That gladness at their good fortune is sympathetic joy. The object is the person who is happy. Envy takes the same kind of news and cannot bear it. The thrill of rapture can be about a song or the breath; this factor is specifically gladness at someone else.'
		},
		aliases: ['sympathetic joy', 'mudita', 'gladness', 'appreciative joy']
	},
	{
		id: 'pannindriya',
		pali: 'Paññindriya',
		gloss: 'Wisdom',
		group: 'beautiful',
		...pronounce(
			[
				['pañ', 'puhny'],
				['ñin', 'nyin'],
				['dri', 'dri'],
				['ya', 'yuh']
			],
			[1],
			'/paɲˈɲin.dri.ja/'
		),
		trap: 'ñ is ny, and the cluster is held. The stress is on ñin.',
		range:
			'47 cittas: 12 sense-sphere beautiful cittas with knowledge, all 15 fine-material, all 12 immaterial, and all 8 supramundane.',
		example: {
			scene:
				'The urge to check their profile again is seen as a surge that arose and will pass, not as a self who needs to know.',
			read: 'That understanding — impermanent, unsatisfactory, and not-self — is the wisdom faculty. The sheet says it takes the lead in seeing, as a lamp dispels darkness in a room, and that it uproots delusion. Knowing "anger is here," without that seeing, is mindfulness. A beautiful moment can have mindfulness and still lack wisdom.'
		},
		aliases: ['wisdom', 'understanding', 'panna', 'insight', 'pannindriya', 'knowledge']
	}
];

const expected: Record<GroupId, number> = {
	universal: 7,
	occasional: 6,
	unwholesome: 14,
	beautiful: 25
};

const ids = new Set<string>();
if (cetasikas.length !== 52) {
	throw new Error(`Expected 52 cetasikas, found ${cetasikas.length}`);
}
for (const group of groupOrder) {
	const count = cetasikas.filter((factor) => factor.group === group).length;
	if (count !== expected[group]) {
		throw new Error(`Expected ${expected[group]} ${group} factors, found ${count}`);
	}
}
for (const factor of cetasikas) {
	if (ids.has(factor.id)) throw new Error(`Duplicate cetasika id ${factor.id}`);
	ids.add(factor.id);
	if (factor.syllables.length === 0) throw new Error(`No syllables for ${factor.id}`);
	for (const index of factor.stress) {
		if (index < 0 || index >= factor.syllables.length) {
			throw new Error(`Bad stress for ${factor.id}`);
		}
	}
	if (!factor.example.scene || !factor.example.read) throw new Error(`Missing example for ${factor.id}`);
	if (!factor.ipa.startsWith('/')) throw new Error(`Missing IPA for ${factor.id}`);
}

export function getCetasika(id: string): Cetasika | undefined {
	return cetasikas.find((factor) => factor.id === id);
}

export function neighbors(id: string): { prev?: Cetasika; next?: Cetasika } {
	const index = cetasikas.findIndex((factor) => factor.id === id);
	return {
		prev: index > 0 ? cetasikas[index - 1] : undefined,
		next: index >= 0 ? cetasikas[index + 1] : undefined
	};
}

export function positionInGroup(factor: Cetasika): { index: number; total: number } {
	const inGroup = cetasikas.filter((item) => item.group === factor.group);
	return {
		index: inGroup.findIndex((item) => item.id === factor.id) + 1,
		total: inGroup.length
	};
}
