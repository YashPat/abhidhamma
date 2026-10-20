import type { Syllable, Term } from './types';

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

export const vowelKey: { mark: string; hint: string; asIn: string }[] = [
	{ mark: 'a', hint: 'uh', asIn: 'sofa' },
	{ mark: 'ā', hint: 'aa', asIn: 'father' },
	{ mark: 'i', hint: 'i', asIn: 'pin' },
	{ mark: 'ī', hint: 'ee', asIn: 'peak' },
	{ mark: 'u', hint: 'u', asIn: 'put' },
	{ mark: 'ū', hint: 'oo', asIn: 'pool' },
	{ mark: 'e', hint: 'ay', asIn: 'they' },
	{ mark: 'o', hint: 'oh', asIn: 'go' }
];

export const consonantNotes: string[] = [
	'An apostrophe after a consonant means a puff of air. ph, th, and kh are p, t, and k plus that puff, not f and not the th in think.',
	'bh, dh, and gh are b, d, and g plus a puff. bh is not v.',
	'c is the ch in church. ch in the romanization adds the puff.',
	'ñ is the ny in canyon. ṭ, ḍ, and ṇ are t, d, and n with the tongue curled back.',
	'A consonant written twice is held for a beat, as in phassa or kamma.',
	'Stress falls on the last heavy syllable that is not the final one. A syllable is heavy when its vowel is long (ā, ī, ū, e, o) or when it ends in a consonant.'
];

export const terms: Term[] = [
	{
		id: 'citta',
		pali: 'Citta',
		gloss: 'Consciousness, the bare knowing of an object',
		where: 'Citta sheet',
		...pronounce(
			[
				['cit', 'chit'],
				['ta', 'tuh']
			],
			[0],
			'/ˈt͡ʃit.ta/'
		),
		trap: 'c is ch.'
	},
	{
		id: 'cetasika',
		pali: 'Cetasika',
		gloss: 'A mental factor arising with consciousness',
		where: 'Citta and cetasika sheets',
		...pronounce(
			[
				['ce', 'chay'],
				['ta', 'tuh'],
				['si', 'si'],
				['ka', 'kuh']
			],
			[0],
			'/ˈt͡ʃeː.ta.si.ka/'
		)
	},
	{
		id: 'sampayoga',
		pali: 'Sampayoga',
		gloss: 'Association: factors yoked into one moment',
		where: 'Sampayoga sheet',
		...pronounce(
			[
				['sam', 'suhm'],
				['pa', 'puh'],
				['yo', 'yoh'],
				['ga', 'guh']
			],
			[2],
			'/sam.paˈjoː.ga/'
		)
	},
	{
		id: 'sangaha',
		pali: 'Saṅgaha',
		gloss: 'Inclusion: which factors a citta contains',
		where: 'Sampayoga sheet',
		...pronounce(
			[
				['saṅ', 'suhng'],
				['ga', 'guh'],
				['ha', 'huh']
			],
			[0],
			'/ˈsaŋ.ga.ha/'
		)
	},
	{
		id: 'vithi',
		pali: 'Vīthi',
		gloss: 'A cognitive process, the fixed sequence of cittas',
		where: 'Vīthi sheet',
		...pronounce(
			[
				['vī', 'vee'],
				['thi', "t'hi"]
			],
			[0],
			'/ˈʋiː.tʰi/'
		),
		trap: 'th is t plus a puff of air, not the th in think.'
	},
	{
		id: 'kamma',
		pali: 'Kamma',
		gloss: 'Volition in wholesome and unwholesome cittas, made in the javanas',
		where: 'Cetasika sheet',
		...pronounce(
			[
				['kam', 'kuhm'],
				['ma', 'muh']
			],
			[0],
			'/ˈkam.ma/'
		)
	},
	{
		id: 'kusala',
		pali: 'Kusala',
		gloss: 'Wholesome',
		where: 'Citta sheet',
		...pronounce(
			[
				['ku', 'ku'],
				['sa', 'suh'],
				['la', 'luh']
			],
			[0],
			'/ˈku.sa.la/'
		)
	},
	{
		id: 'akusala',
		pali: 'Akusala',
		gloss: 'Unwholesome',
		where: 'Citta sheet',
		...pronounce(
			[
				['a', 'uh'],
				['ku', 'ku'],
				['sa', 'suh'],
				['la', 'luh']
			],
			[1],
			'/aˈku.sa.la/'
		)
	},
	{
		id: 'vipaka',
		pali: 'Vipāka',
		gloss: 'Resultant. Kamma arriving, not being made',
		where: 'Citta sheet',
		...pronounce(
			[
				['vi', 'vi'],
				['pā', 'paa'],
				['ka', 'kuh']
			],
			[1],
			'/ʋiˈpaː.ka/'
		)
	},
	{
		id: 'kiriya',
		pali: 'Kiriya',
		gloss: 'Functional. Action that leaves no kammic trace',
		where: 'Citta sheet',
		...pronounce(
			[
				['ki', 'ki'],
				['ri', 'ri'],
				['ya', 'yuh']
			],
			[0],
			'/ˈki.ri.ja/'
		)
	},
	{
		id: 'sobhana',
		pali: 'Sobhana',
		gloss: 'Beautiful',
		where: 'Sampayoga sheet',
		...pronounce(
			[
				['so', 'soh'],
				['bha', "b'huh"],
				['na', 'nuh']
			],
			[0],
			'/ˈsoː.bʰa.na/'
		),
		trap: 'bh is b plus a puff of air, not v.'
	},
	{
		id: 'ahetuka',
		pali: 'Ahetuka',
		gloss: 'Rootless. No greed, hatred, delusion, or their opposites',
		where: 'Citta sheet',
		...pronounce(
			[
				['a', 'uh'],
				['he', 'hay'],
				['tu', 'tu'],
				['ka', 'kuh']
			],
			[1],
			'/aˈheː.tu.ka/'
		)
	},
	{
		id: 'jhana',
		pali: 'Jhāna',
		gloss: 'Five levels, each defined by which factors remain',
		where: 'Citta sheet',
		...pronounce(
			[
				['jhā', "j'haa"],
				['na', 'nuh']
			],
			[0],
			'/ˈd͡ʒʰaː.na/'
		),
		trap: 'jh is j plus a puff of air.'
	},
	{
		id: 'somanassa',
		pali: 'Somanassa',
		gloss: 'Mental joy, a mode of feeling',
		where: 'Citta sheet',
		...pronounce(
			[
				['so', 'soh'],
				['ma', 'muh'],
				['nas', 'nuhs'],
				['sa', 'suh']
			],
			[2],
			'/so.maˈnas.sa/'
		)
	},
	{
		id: 'domanassa',
		pali: 'Domanassa',
		gloss: 'Displeasure. The citta sheet gives it to exactly two cittas, both hatred-rooted',
		where: 'Citta sheet',
		...pronounce(
			[
				['do', 'doh'],
				['ma', 'muh'],
				['nas', 'nuhs'],
				['sa', 'suh']
			],
			[2],
			'/do.maˈnas.sa/'
		)
	},
	{
		id: 'upekkha',
		pali: 'Upekkhā',
		gloss: 'Neutral feeling. The citta sheet also calls this feeling equanimity',
		where: 'Citta sheet',
		...pronounce(
			[
				['u', 'u'],
				['pek', 'pek'],
				['khā', "k'haa"]
			],
			[1],
			'/uˈpek.kʰaː/'
		),
		trap: 'kh is k plus a puff of air. This is a feeling-tone, not the cetasika tatramajjhattatā.'
	},
	{
		id: 'dukkha',
		pali: 'Dukkha',
		gloss: 'Bodily pain. One citta: unwholesome-resultant body-consciousness',
		where: 'Citta sheet',
		...pronounce(
			[
				['duk', 'duk'],
				['kha', "k'huh"]
			],
			[0],
			'/ˈduk.kʰa/'
		)
	},
	{
		id: 'sukha',
		pali: 'Sukha',
		gloss: 'Bodily pleasure in one resultant. As a jhāna factor, mental joy (somanassa), through the fourth jhāna',
		where: 'Citta sheet',
		...pronounce(
			[
				['su', 'su'],
				['kha', "k'huh"]
			],
			[0],
			'/ˈsu.kʰa/'
		)
	},
	{
		id: 'nibbana',
		pali: 'Nibbāna',
		gloss: 'The object of the path and fruition cittas',
		where: 'Citta sheet',
		...pronounce(
			[
				['nib', 'nib'],
				['bā', 'baa'],
				['na', 'nuh']
			],
			[1],
			'/nibˈbaː.na/'
		)
	},
	{
		id: 'magga',
		pali: 'Magga',
		gloss: 'Path consciousness. Four of them, each arising once',
		where: 'Citta sheet',
		...pronounce(
			[
				['mag', 'muhg'],
				['ga', 'guh']
			],
			[0],
			'/ˈmag.ga/'
		)
	},
	{
		id: 'phala',
		pali: 'Phala',
		gloss: 'Fruition, the resultant that follows a path immediately',
		where: 'Citta sheet',
		...pronounce(
			[
				['pha', "p'huh"],
				['la', 'luh']
			],
			[0],
			'/ˈpʰa.la/'
		),
		trap: 'ph is p plus a puff of air, not f.'
	},
	{
		id: 'nana',
		pali: 'Ñāṇa',
		gloss: 'Knowledge. The citta sheet’s "with knowledge" class',
		where: 'Citta sheet',
		...pronounce(
			[
				['ñā', 'nyaa'],
				['ṇa', 'nuh']
			],
			[0],
			'/ˈɲaː.ɳa/'
		),
		trap: 'ñ is ny. ṇ is n with the tongue curled back.'
	},
	{
		id: 'patigha',
		pali: 'Paṭigha',
		gloss: 'Aversion. Hatred-rooted cittas are always with it',
		where: 'Citta sheet',
		...pronounce(
			[
				['pa', 'puh'],
				['ṭi', 'ti'],
				['gha', "g'huh"]
			],
			[0],
			'/ˈpa.ʈi.gʰa/'
		),
		trap: 'ṭ is a retroflex t. gh is g plus a puff of air.'
	},
	{
		id: 'metta',
		pali: 'Mettā',
		gloss: 'Loving-kindness, the full form of non-hatred',
		where: 'Cetasika sheet, under adosa',
		...pronounce(
			[
				['met', 'met'],
				['tā', 'taa']
			],
			[0],
			'/ˈmet.taː/'
		)
	},
	{
		id: 'bhumi',
		pali: 'Bhūmi',
		gloss: 'Plane: sense sphere, fine-material, immaterial, or supramundane',
		where: 'Citta sheet',
		...pronounce(
			[
				['bhū', "b'hoo"],
				['mi', 'mi']
			],
			[0],
			'/ˈbʰuː.mi/'
		),
		trap: 'bh is b plus a puff of air.'
	},
	{
		id: 'jati',
		pali: 'Jāti',
		gloss: 'Nature: unwholesome, wholesome, resultant, or functional',
		where: 'Citta sheet',
		...pronounce(
			[
				['jā', 'jaa'],
				['ti', 'ti']
			],
			[0],
			'/ˈd͡ʒaː.ti/'
		)
	},
	{
		id: 'niyata',
		pali: 'Niyata',
		gloss: 'Fixed. The factor must arise whenever that citta arises',
		where: 'Sampayoga sheet',
		...pronounce(
			[
				['ni', 'ni'],
				['ya', 'yuh'],
				['ta', 'tuh']
			],
			[0],
			'/ˈni.ja.ta/'
		)
	},
	{
		id: 'aniyata',
		pali: 'Aniyata',
		gloss: 'Unfixed. Possible in that citta, and sometimes absent',
		where: 'Sampayoga sheet',
		...pronounce(
			[
				['a', 'uh'],
				['ni', 'ni'],
				['ya', 'yuh'],
				['ta', 'tuh']
			],
			[1],
			'/aˈni.ja.ta/'
		)
	},
	{
		id: 'bhavanga',
		pali: 'Bhavaṅga',
		gloss: 'Life-continuum, the passive citta between processes',
		where: 'Vīthi sheet',
		...pronounce(
			[
				['bha', "b'huh"],
				['vaṅ', 'vuhng'],
				['ga', 'guh']
			],
			[1],
			'/bʰaˈʋaŋ.ga/'
		),
		trap: 'bh is b plus a puff of air.'
	},
	{
		id: 'javana',
		pali: 'Javana',
		gloss: 'Impulsion. Where wholesome and unwholesome cittas make kamma. An arahant’s javanas produce none',
		where: 'Vīthi sheet',
		...pronounce(
			[
				['ja', 'juh'],
				['va', 'vuh'],
				['na', 'nuh']
			],
			[0],
			'/ˈd͡ʒa.ʋa.na/'
		)
	},
	{
		id: 'votthapana',
		pali: 'Votthapana',
		gloss: 'Determining. Settles the character of the javanas that follow',
		where: 'Vīthi sheet',
		...pronounce(
			[
				['vot', 'vot'],
				['tha', "t'huh"],
				['pa', 'puh'],
				['na', 'nuh']
			],
			[0],
			'/ˈʋot.tʰa.pa.na/'
		),
		trap: 'th is t plus a puff of air.'
	},
	{
		id: 'tadarammana',
		pali: 'Tadārammaṇa',
		gloss: 'Registration, the brief hold after impulsion',
		where: 'Vīthi sheet',
		...pronounce(
			[
				['ta', 'tuh'],
				['dā', 'daa'],
				['ram', 'ruhm'],
				['ma', 'muh'],
				['ṇa', 'nuh']
			],
			[2],
			'/ta.daːˈram.ma.ɳa/'
		),
		trap: 'ṇ is n with the tongue curled back.'
	},
	{
		id: 'ekuppada',
		pali: 'Ekuppāda',
		gloss: 'Arising together',
		where: 'Sampayoga sheet',
		...pronounce(
			[
				['e', 'ay'],
				['kup', 'kup'],
				['pā', 'paa'],
				['da', 'duh']
			],
			[2],
			'/eː.kupˈpaː.da/'
		)
	},
	{
		id: 'ekanirodha',
		pali: 'Ekanirodha',
		gloss: 'Ceasing together',
		where: 'Sampayoga sheet',
		...pronounce(
			[
				['e', 'ay'],
				['ka', 'kuh'],
				['ni', 'ni'],
				['ro', 'roh'],
				['dha', "d'huh"]
			],
			[3],
			'/eː.ka.niˈroː.dʰa/'
		)
	},
	{
		id: 'ekalambana',
		pali: 'Ekālambana',
		gloss: 'Having the same object',
		where: 'Sampayoga sheet',
		...pronounce(
			[
				['e', 'ay'],
				['kā', 'kaa'],
				['lam', 'luhm'],
				['ba', 'buh'],
				['na', 'nuh']
			],
			[2],
			'/eː.kaːˈlam.ba.na/'
		)
	},
	{
		id: 'ekavatthuka',
		pali: 'Ekavatthuka',
		gloss: 'Having the same base',
		where: 'Sampayoga sheet',
		...pronounce(
			[
				['e', 'ay'],
				['ka', 'kuh'],
				['vat', 'vuht'],
				['thu', "t'hu"],
				['ka', 'kuh']
			],
			[2],
			'/eː.kaˈʋat.tʰu.ka/'
		)
	}
];
