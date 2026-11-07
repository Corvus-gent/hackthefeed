// Sample content for the onboarding prototype. Everything here stands in for what the
// agent (reading the website and socials) and the Oriane API would return.

export type IconName =
  | 'check' | 'left' | 'right' | 'key' | 'chat' | 'globe' | 'tiktok' | 'instagram' | 'youtube'
  | 'user' | 'users' | 'building' | 'plus' | 'x' | 'spark' | 'search' | 'tag' | 'film' | 'flag'
  | 'grid' | 'play' | 'share' | 'cocktail' | 'bowl' | 'plane' | 'dumbbell' | 'drop' | 'shirt'
  | 'laptop' | 'chart' | 'house' | 'book' | 'gamepad' | 'sofa' | 'can' | 'upload';

export type NicheId =
  | 'nightlife' | 'food' | 'drinks' | 'travel' | 'fitness' | 'beauty' | 'fashion'
  | 'tech' | 'finance' | 'realestate' | 'education' | 'gaming' | 'home';

export type SocialKey = 'tiktok' | 'instagram' | 'youtube';

export type Niche = { id: NicheId; t: string; d: string; v: string; c: [string, string]; icon: IconName; g: string[] };
// f/v (followers, avg views) are sample numbers; real brands get stats from Oriane, so they omit them.
export type Competitor = { h: string; n: string; c: string; f?: string; v?: string; site?: string; product?: string; img?: string[] };
export type Belief = { id: string; s: string; t: string; vs: string; ex: string };
export type Format = {
  id: string; t: string; cap: string; handle: string; dur: string; c: [string, string]; icon: IconName;
  views: string; watch: number; posts: number; growth: number; comps: number; fits: string[]; s: number[];
};
export type Product = { id: string; title: string; url?: string; images: string[]; selected: boolean; imported: boolean };
export type SiteInfo = {
  host: string; title: string; description: string;
  socials: Partial<Record<SocialKey, string>>; products: Product[];
  source: 'live' | 'saved'; // saved = bundled snapshot, used when the live site can't be read
};

export const SOCIALS: { key: SocialKey; label: string; icon: IconName; ph: string }[] = [
  { key: 'tiktok', label: 'TikTok', icon: 'tiktok', ph: 'TikTok @handle or link' },
  { key: 'instagram', label: 'Instagram', icon: 'instagram', ph: 'Instagram @handle or link' },
  { key: 'youtube', label: 'YouTube', icon: 'youtube', ph: 'YouTube @channel or link' },
];

// v = median views of the niche's top videos (sample); c = tile gradient until real thumbnails exist.
export const NICHES: Niche[] = [
  { id: 'nightlife', t: 'Nightlife & events', d: 'Bars, clubs, events and nights out.', v: '1.4M', c: ['#3a1c71', '#d76d77'], icon: 'cocktail', g: ['Bars & clubs', 'Date nights', 'Solo nights out', 'Live music', 'New openings', 'Hidden spots'] },
  { id: 'food', t: 'Food & drink', d: 'Restaurants, recipes and what to eat next.', v: '2.3M', c: ['#f2994a', '#c2410c'], icon: 'bowl', g: ['Restaurant reviews', 'Recipes', 'Street food', 'Cocktails', 'Healthy eating', 'Food trucks'] },
  { id: 'drinks', t: 'Drinks & beverages', d: 'Better-for-you sodas, energy drinks and what to sip.', v: '1.7M', c: ['#065f46', '#f59e0b'], icon: 'can', g: ['Functional sodas', 'Energy drinks', 'Gut health', 'Taste tests', 'Mocktails', 'Healthy swaps'] },
  { id: 'travel', t: 'Travel', d: 'Places to go and how to get there.', v: '1.9M', c: ['#0e7490', '#5ec8e5'], icon: 'plane', g: ['City guides', 'Budget travel', 'Luxury stays', 'Weekend trips', 'Van life', 'Travel hacks'] },
  { id: 'fitness', t: 'Fitness', d: 'Workouts, progress and staying healthy.', v: '1.1M', c: ['#0f766e', '#34d399'], icon: 'dumbbell', g: ['Home workouts', 'Strength', 'Running', 'Yoga', 'Nutrition', 'Transformations'] },
  { id: 'beauty', t: 'Beauty', d: 'Skincare, makeup and daily routines.', v: '1.6M', c: ['#be185d', '#f9a8d4'], icon: 'drop', g: ['Skincare', 'Makeup tutorials', 'Hair', 'Product reviews', 'Nails', 'Routines'] },
  { id: 'fashion', t: 'Fashion', d: 'Outfits, styling and what to wear.', v: '1.3M', c: ['#1f2937', '#6b7280'], icon: 'shirt', g: ['Outfit ideas', 'Thrifting', 'Streetwear', 'Hauls', 'Styling tips', 'Sustainable fashion'] },
  { id: 'tech', t: 'Tech', d: 'Gadgets, apps and tools that save time.', v: '890K', c: ['#3730a3', '#38bdf8'], icon: 'laptop', g: ['Gadget reviews', 'AI tools', 'Productivity', 'Coding', 'Desk setups', 'Startups'] },
  { id: 'finance', t: 'Finance', d: 'Money, investing and side income.', v: '760K', c: ['#14532d', '#4ade80'], icon: 'chart', g: ['Personal finance', 'Investing', 'Side hustles', 'Budgeting', 'Crypto', 'Property'] },
  { id: 'realestate', t: 'Real estate', d: 'Home tours, listings and the market.', v: '940K', c: ['#92400e', '#e7b07a'], icon: 'house', g: ['Home tours', 'Market updates', 'First-time buyers', 'Renovation', 'Luxury listings', 'Agent life'] },
  { id: 'education', t: 'Education', d: 'Explainers, study tips and learning.', v: '820K', c: ['#5b21b6', '#2dd4bf'], icon: 'book', g: ['Study tips', 'Languages', 'Science explainers', 'History', 'Career advice', 'Exam prep'] },
  { id: 'gaming', t: 'Gaming', d: 'Games, streams and setups.', v: '2.0M', c: ['#4c1d95', '#a855f7'], icon: 'gamepad', g: ['Let’s plays', 'Esports', 'Game reviews', 'Speedruns', 'Indie games', 'Setups'] },
  { id: 'home', t: 'Home & design', d: 'Interiors, DIY and making space work.', v: '1.2M', c: ['#7c5c4e', '#d6b8a8'], icon: 'sofa', g: ['Interior design', 'DIY', 'Organisation', 'Small spaces', 'Gardening', 'Before & after'] },
];

// Niche detection: keywords in the website text, address, handles and description.
// k = keywords (4+ letters match inside words, e.g. "drinkwildwonder"; shorter ones must be whole words),
// w = fallback description when the website gave us none.
// ponytail: keyword scoring; swap for an LLM classifier over the site text when accuracy matters.
export const NICHE_HINTS: Record<NicheId, { k: string[]; w: string }> = {
  nightlife: { k: ['bar', 'pub', 'club', 'night', 'cocktail', 'party', 'lounge', 'events'], w: 'A guide to going out: bar picks, date-night ideas and new openings.' },
  food: { k: ['eat', 'food', 'kitchen', 'cafe', 'coffee', 'restaurant', 'recipe', 'bake', 'pizza', 'ramen', 'chef', 'taco', 'burger'], w: 'A neighbourhood restaurant sharing dishes, recipes and what happens behind the pass.' },
  drinks: { k: ['tea', 'gut', 'soda', 'sparkling', 'drink', 'beverage', 'prebiotic', 'probiotic', 'energy', 'juice', 'kombucha', 'caffeine', 'seltzer'], w: 'A drinks brand making better-for-you sodas, with new flavours and taste tests.' },
  travel: { k: ['travel', 'trip', 'tour', 'hotel', 'journey', 'wander', 'nomad', 'flight', 'explore', 'getaway'], w: 'Travel guides and itineraries for long weekends and short trips, with costs and routes for each.' },
  fitness: { k: ['fit', 'gym', 'run', 'workout', 'train', 'yoga', 'pilates', 'lift', 'strength', 'coach'], w: 'A training studio and coaching programme for strength, mobility and habits that stick.' },
  beauty: { k: ['spa', 'beauty', 'skin', 'glow', 'makeup', 'cosmetic', 'lash', 'nail', 'salon', 'hair'], w: 'A skincare brand with simple routines and products for sensitive skin.' },
  fashion: { k: ['fashion', 'style', 'wear', 'apparel', 'boutique', 'outfit', 'closet', 'denim', 'sneaker'], w: 'An independent clothing label with everyday pieces, styling ideas and new drops each month.' },
  tech: { k: ['ai', 'app', 'dev', 'tech', 'software', 'code', 'digital', 'gadget', 'cloud', 'labs'], w: 'Software that helps small teams work faster, with tutorials and product updates.' },
  finance: { k: ['tax', 'finance', 'money', 'invest', 'wealth', 'capital', 'budget', 'bank', 'crypto', 'fund'], w: 'Plain-language money advice on budgeting, investing and building wealth over time.' },
  realestate: { k: ['realty', 'estate', 'homes', 'property', 'properties', 'realtor', 'broker', 'rent', 'listing'], w: 'A local real-estate team helping buyers and renters find homes, with tours and market updates.' },
  education: { k: ['edu', 'learn', 'school', 'academy', 'tutor', 'course', 'study', 'class', 'teach'], w: 'Online courses and study guides that make hard subjects easier to learn.' },
  gaming: { k: ['game', 'gaming', 'play', 'esports', 'arcade', 'stream', 'pixel', 'quest'], w: 'A gaming channel and community with reviews, live streams and tips.' },
  home: { k: ['diy', 'home', 'interior', 'decor', 'design', 'furniture', 'living', 'garden', 'house'], w: 'An interior design studio sharing room makeovers, DIY projects and decor ideas.' },
};

export const GENERIC_WHAT = 'A business sharing its products, its story and updates with its audience.';

// Nightlife has hand-written detail; other niches are built from the compact sets below.
export const NIGHTLIFE_COMPETITORS: Competitor[] = [
  { h: 'latenight.sf', n: 'Late Night SF', f: '212K', v: '96K', c: '#e0525d' },
  { h: 'soloinsf', n: 'Solo in SF', f: '88K', v: '61K', c: '#2b9a7a' },
  { h: 'mission.after.dark', n: 'Mission After Dark', f: '141K', v: '74K', c: '#d0861b' },
  { h: 'baybites.daily', n: 'Bay Bites Daily', f: '305K', v: '120K', c: '#3d6fe0' },
];
export const NIGHTLIFE_BELIEFS: Belief[] = [
  { id: 'solo', s: 'Going solo', t: 'Going out alone beats waiting for friends to be free.', vs: 'Competitors film group nights and assume you have a crew.', ex: 'POV: you went out alone in SF and it was the best night of the month' },
  { id: 'hidden', s: 'Undiscovered spots', t: 'The best places aren’t on any list yet.', vs: 'Competitors repost the same top-10 bars everyone already knows.', ex: 'This bar has no sign and no website. Here’s how to get in.' },
  { id: 'budget', s: 'Under $40', t: 'A great night shouldn’t cost more than $40.', vs: 'Competitors chase expensive openings and comped tables.', ex: 'My whole night in the Mission cost $38. Receipts on screen.' },
  { id: 'honest', s: 'Honest reviews', t: 'An honest “skip it” is worth more than sponsored hype.', vs: 'Competitors rarely say a place is bad.', ex: 'Everyone’s posting this new rooftop. Here’s why I’d skip it.' },
  { id: 'locals', s: 'Locals know best', t: 'People who live here know better than any algorithm.', vs: 'Competitors build lists from trending hashtags.', ex: 'I asked 10 bartenders where they drink on their night off.' },
];
export const NIGHTLIFE_FORMATS: Format[] = [
  { id: 'door', t: 'Getting past the door', cap: 'How I got into the bar with no sign', handle: '@latenight.sf', dur: '0:31', c: ['#1e1b4b', '#7c3aed'], icon: 'key', views: '538K', watch: 66, posts: 412, growth: 71, comps: 0, fits: ['hidden'], s: [3, 4, 4, 5, 6, 6, 8, 9, 11, 12, 15, 17] },
  { id: 'pov', t: 'POV: I went alone', cap: 'POV: you went out alone in SF and it was the best night', handle: '@soloinsf', dur: '0:24', c: ['#831843', '#f472b6'], icon: 'user', views: '412K', watch: 62, posts: 1284, growth: 38, comps: 2, fits: ['solo'], s: [6, 7, 7, 8, 8, 9, 10, 10, 11, 12, 13, 14] },
  { id: 'cost', t: 'What $40 gets you', cap: 'What $40 gets you on Valencia St', handle: '@mission.after.dark', dur: '0:42', c: ['#14532d', '#84cc16'], icon: 'tag', views: '351K', watch: 59, posts: 967, growth: 24, comps: 1, fits: ['budget', 'honest'], s: [8, 8, 9, 9, 9, 10, 10, 11, 11, 11, 12, 13] },
  { id: 'firstlook', t: 'First look, opening week', cap: 'First look: this bar opened 3 days ago', handle: '@baybites.daily', dur: '0:19', c: ['#0c4a6e', '#22d3ee'], icon: 'spark', views: '264K', watch: 51, posts: 358, growth: 45, comps: 1, fits: ['hidden'], s: [4, 5, 5, 6, 7, 7, 8, 8, 9, 10, 10, 12] },
  { id: 'ranked', t: 'Ranked in 30 seconds', cap: '5 date-night bars, ranked', handle: '@latenight.sf', dur: '0:30', c: ['#7c2d12', '#fb923c'], icon: 'grid', views: '286K', watch: 57, posts: 2140, growth: 12, comps: 3, fits: ['honest', 'locals'], s: [10, 11, 10, 11, 12, 11, 12, 12, 13, 12, 13, 13] },
  { id: 'reply', t: 'Answering your comments', cap: 'Replying to @maya: where can I go alone on a Tuesday?', handle: '@soloinsf', dur: '0:27', c: ['#27272a', '#a1a1aa'], icon: 'chat', views: '198K', watch: 54, posts: 1530, growth: -6, comps: 2, fits: ['locals'], s: [13, 13, 12, 13, 12, 12, 11, 12, 11, 11, 11, 10] },
];

type CompactSet = {
  c: [handle: string, name: string][];
  b: [id: string, label: string, belief: string, competitors: string, hook: string][];
  f: [name: string, caption: string, icon: IconName, fits: string[]][];
};

export const NICHE_SETS: Partial<Record<NicheId, CompactSet>> = {
  food: {
    c: [['eatwithmarco', 'Eat with Marco'], ['thelinecook', 'The Line Cook'], ['smallplates.nyc', 'Small Plates NYC'], ['dumplingdiaries', 'Dumpling Diaries']],
    b: [['local', 'Neighbourhood spots', 'The best food is ten minutes from home, not across town.', 'Competitors chase hyped openings in other neighbourhoods.', 'The best ramen in the city is above a laundromat. Ten minutes from you.'],
      ['kitchen', 'Behind the pass', 'Show the kitchen, not just the plate.', 'Competitors only film the finished dish.', 'What 400 covers on a Saturday look like from the pass.'],
      ['price', 'Price on screen', 'Every dish should come with its price.', 'Competitors never say what things cost.', 'Every dish on this menu under $15, ranked.']],
    f: [['Behind the pass', 'Saturday night service, start to finish', 'film', ['kitchen']], ['One dish, three prices', '$5 vs $25 vs $95 ramen', 'tag', ['price']], ['Ten minutes from home', 'Best tacos 10 minutes from downtown', 'search', ['local']], ['Recipe in 30 seconds', 'Our signature sauce in 30 seconds', 'spark', ['kitchen']], ['Order this, skip that', 'What to order here, and what to skip', 'grid', ['price', 'local']]],
  },
  travel: {
    c: [['weekendwander', 'Weekend Wander'], ['farefinder.trips', 'Fare Finder'], ['slowroutes', 'Slow Routes'], ['carryononly', 'Carry-On Only']],
    b: [['cost', 'Real costs', 'Every itinerary should show what it actually cost.', 'Competitors post sponsored stays and hide the price.', 'I spent 3 days in Lisbon for €210. Every receipt.'],
      ['slow', 'Fewer places', 'See one city well instead of five badly.', 'Competitors race through ten countries in one reel.', 'One street in Porto, one whole day.'],
      ['local', 'Off the list', 'Skip the top-10 list and ask locals.', 'Competitors film the same landmarks.', 'I asked a taxi driver in Naples where he eats.']],
    f: [['Trip on a budget', 'Lisbon for 3 days: €210 total', 'tag', ['cost']], ['One-street guide', 'Everything worth doing on one street in Porto', 'search', ['slow', 'local']], ['Pack with me', 'Two weeks, one carry-on', 'grid', ['cost']], ['Local picks', 'I asked locals where to eat in Naples', 'chat', ['local']], ['Itinerary in 30s', '48 hours in Copenhagen, planned', 'spark', ['slow']]],
  },
  fitness: {
    c: [['liftwithlena', 'Lift with Lena'], ['runclub.daily', 'Run Club Daily'], ['mobilitymike', 'Mobility Mike'], ['the20minworkout', 'The 20 Minute Workout']],
    b: [['short', 'Short sessions', 'Twenty minutes, done right, beats an hour you skip.', 'Competitors post 90-minute splits nobody can follow.', 'The 20-minute workout I do on busy days.'],
      ['real', 'Real progress', 'Show slow, honest progress, not overnight transformations.', 'Competitors post filtered before-and-afters.', 'Month 6 of lifting. Here’s what actually changed.'],
      ['form', 'Form first', 'Good form matters more than heavy weight.', 'Competitors chase PRs and skip technique.', 'Three squat mistakes I see every day in the gym.']],
    f: [['Workout in 20', 'Full body, 20 minutes, no equipment', 'dumbbell', ['short']], ['Fix your form', '3 squat mistakes, fixed', 'user', ['form']], ['Progress diary', 'Month 6: what changed', 'chart', ['real']], ['Gym vs home', 'Same workout, gym vs living room', 'grid', ['short']], ['Coach reacts', 'Reacting to your deadlift videos', 'chat', ['form', 'real']]],
  },
  beauty: {
    c: [['glowdaily', 'Glow Daily'], ['skinbyana', 'Skin by Ana'], ['barefaced.co', 'Bare Faced Co'], ['thelab.skin', 'The Lab Skin']],
    b: [['simple', 'Fewer steps', 'Three products beat a twelve-step routine.', 'Competitors push long routines and hauls.', 'My whole routine is three products. Here they are.'],
      ['gentle', 'Gentle first', 'Sensitive skin needs fewer actives, not more.', 'Competitors stack acids and retinol.', 'What happened when I stopped using five actives.'],
      ['honest', 'Honest reviews', 'Say when a product doesn’t work.', 'Competitors only post sponsored favourites.', 'Viral serum, 30 days later: would I rebuy?']],
    f: [['30-day test', 'Viral serum, 30 days later', 'drop', ['honest']], ['3-step routine', 'My morning routine in 3 steps', 'spark', ['simple']], ['Ingredient explained', 'What niacinamide actually does', 'book', ['gentle']], ['Get ready with me', 'GRWM: 5 minutes, sensitive skin', 'user', ['simple', 'gentle']], ['Dupe or not', '$80 vs $12 moisturiser', 'tag', ['honest']]],
  },
  fashion: {
    c: [['everydaythreads', 'Everyday Threads'], ['thriftwithtess', 'Thrift with Tess'], ['fitcheck.daily', 'Fit Check Daily'], ['capsule.closet', 'Capsule Closet']],
    b: [['fewer', 'Fewer, better', 'A small wardrobe you love beats a big one you don’t.', 'Competitors post a new haul every week.', '30 outfits from 12 pieces.'],
      ['secondhand', 'Secondhand first', 'The best pieces are already out there.', 'Competitors only show new drops.', 'A full outfit from the thrift store for $40.'],
      ['real', 'Real bodies', 'Show clothes on real bodies, in real light.', 'Competitors only post studio shots.', 'The same jacket on three body types.']],
    f: [['One piece, five ways', 'One blazer, five outfits', 'shirt', ['fewer']], ['Thrift flip', 'Full outfit for $40, secondhand', 'tag', ['secondhand']], ['Try-on, real light', 'Trying on this season’s jackets, no filter', 'user', ['real']], ['Capsule wardrobe', '12 pieces, 30 outfits', 'grid', ['fewer']], ['Fit check', 'What I wore this week', 'spark', ['real']]],
  },
  tech: {
    c: [['shipfaster.dev', 'Ship Faster'], ['toolsforteams', 'Tools for Teams'], ['theaiweekly', 'The AI Weekly'], ['deskofdev', 'Desk of Dev']],
    b: [['useful', 'Useful over shiny', 'Show what a tool does for real work, not demos.', 'Competitors post launch-day hype.', 'I used this AI tool for a week of real work.'],
      ['small', 'Built for small teams', 'Small teams need fewer tools that do more.', 'Competitors review enterprise stacks.', 'Our whole 5-person stack, and what it costs.'],
      ['plain', 'Plain language', 'Explain tech so anyone can follow.', 'Competitors talk in jargon.', 'APIs explained with a restaurant menu.']],
    f: [['Tool in 30 seconds', 'This tool saved me 5 hours a week', 'laptop', ['useful']], ['Real-work test', 'I used it for a week. Results.', 'chart', ['useful']], ['Our stack', 'Our whole team stack, priced', 'grid', ['small']], ['Explained simply', 'APIs explained with a menu', 'book', ['plain']], ['Before and after', 'Same task, before and after', 'spark', ['useful', 'small']]],
  },
  finance: {
    c: [['moneyplainly', 'Money, Plainly'], ['earlyearner', 'Early Earner'], ['budgetwithbea', 'Budget with Bea'], ['indexandchill', 'Index and Chill']],
    b: [['boring', 'Boring works', 'Slow, boring investing beats hot tips.', 'Competitors chase the next big stock.', 'Why my portfolio is boring on purpose.'],
      ['numbers', 'Real numbers', 'Show the actual numbers, including mistakes.', 'Competitors only post their wins.', 'My real budget for a $4,000 month.'],
      ['plain', 'No jargon', 'Money advice should make sense to anyone.', 'Competitors bury advice in jargon.', 'Index funds explained in 30 seconds.']],
    f: [['My real budget', 'Every dollar of a $4,000 month', 'chart', ['numbers']], ['Explained in 30s', 'Index funds in 30 seconds', 'book', ['plain']], ['Mistakes I made', 'My worst money mistake at 25', 'chat', ['numbers']], ['Boring portfolio', 'What’s in my portfolio and why', 'grid', ['boring']], ['Myth vs fact', 'You don’t need $10k to start investing', 'spark', ['plain', 'boring']]],
  },
  realestate: {
    c: [['hometourshq', 'Home Tours HQ'], ['firstkeyclub', 'First Key Club'], ['thelistingguy', 'The Listing Guy'], ['openhousedaily', 'Open House Daily']],
    b: [['firsttime', 'First-time buyers', 'First-time buyers deserve straight answers.', 'Competitors talk to investors.', 'What $500k buys you in this city right now.'],
      ['honest', 'Honest tours', 'Show the flaws, not just the staging.', 'Competitors only post the best angles.', 'Touring this house: here’s what the photos hide.'],
      ['local', 'Street by street', 'Every neighbourhood is different, block by block.', 'Competitors talk about the whole market.', 'Why two streets apart costs $90k more.']],
    f: [['What $500k buys', 'What $500k buys you here', 'house', ['firsttime']], ['Honest home tour', 'What the listing photos hide', 'film', ['honest']], ['Market in 30s', 'This month’s market in 30 seconds', 'chart', ['local']], ['Street vs street', 'Two streets, $90k apart', 'grid', ['local']], ['Buyer questions', 'Answering first-time buyer questions', 'chat', ['firsttime']]],
  },
  education: {
    c: [['studywithsam', 'Study with Sam'], ['explainitsimply', 'Explain It Simply'], ['the5minclass', 'The 5 Minute Class'], ['languagebites', 'Language Bites']],
    b: [['short', 'Short lessons', 'Five focused minutes beat an hour of notes.', 'Competitors post long lectures.', 'All of photosynthesis in 60 seconds.'],
      ['visual', 'Show, don’t tell', 'Drawings and examples beat definitions.', 'Competitors read slides aloud.', 'The French Revolution explained with coffee cups.'],
      ['mistakes', 'Learn from mistakes', 'Common mistakes teach faster than rules.', 'Competitors only show the right answer.', 'The 3 mistakes every student makes on this exam.']],
    f: [['Explained in 60s', 'Photosynthesis in 60 seconds', 'book', ['short']], ['Study with me', '2-hour study session, real time', 'user', ['short']], ['Explained with objects', 'History explained with coffee cups', 'spark', ['visual']], ['Common mistakes', '3 mistakes on every exam', 'chat', ['mistakes']], ['Exam countdown', '7 days to the exam: the plan', 'grid', ['short', 'mistakes']]],
  },
  gaming: {
    c: [['pixelquest.tv', 'Pixel Quest'], ['speedrunsunday', 'Speedrun Sunday'], ['indiegemsdaily', 'Indie Gems Daily'], ['thecozygamer', 'The Cozy Gamer']],
    b: [['indie', 'Indie first', 'The best games are often the smallest ones.', 'Competitors only cover big releases.', '5 indie games nobody is talking about.'],
      ['honest', 'Honest takes', 'Say when a game isn’t worth the money.', 'Competitors hype every launch.', 'I played it for 20 hours. Wait for a sale.'],
      ['skill', 'Teach the skill', 'Show how to get better, not just highlights.', 'Competitors post clips with no context.', 'The one setting that fixed my aim.']],
    f: [['Hidden gems', '5 indie games nobody talks about', 'gamepad', ['indie']], ['Worth it?', '20 hours in: wait for a sale', 'chat', ['honest']], ['One tip', 'The setting that fixed my aim', 'spark', ['skill']], ['Speedrun breakdown', 'How this record was beaten', 'chart', ['skill']], ['Setup tour', 'My whole setup, priced', 'laptop', ['honest']]],
  },
  home: {
    c: [['smallspacestudio', 'Small Space Studio'], ['diywithdan', 'DIY with Dan'], ['rentfriendlyhome', 'Rent-Friendly Home'], ['theslowhouse', 'The Slow House']],
    b: [['renters', 'Renter-friendly', 'Great rooms shouldn’t need a mortgage.', 'Competitors renovate homes they own.', 'Renter-friendly kitchen makeover, no drilling.'],
      ['budget', 'Small budgets', 'A room can change for under $200.', 'Competitors show five-figure makeovers.', 'Bedroom makeover for $180.'],
      ['real', 'Lived-in', 'Show homes people actually live in.', 'Competitors only post staged rooms.', 'How this room looks after a real week.']],
    f: [['Before and after', 'Bedroom makeover for $180', 'sofa', ['budget']], ['Renter hack', 'No-drill shelf that holds 20kg', 'house', ['renters']], ['Small space tour', '35m² apartment tour', 'grid', ['renters', 'real']], ['DIY in an hour', 'Build this side table in an hour', 'spark', ['budget']], ['Real week', 'This room after a real week', 'film', ['real']]],
  },
};

// Drinks: real competitor brands (product facts from their sites). No follower numbers:
// real stats come from Oriane, so the UI shows the product line instead of made-up counts.
const BLOOM_IMG = 'https://cdn.shopify.com/s/files/1/0143/0952/3556/files/';
export const DRINKS = {
  competitors: [
    { h: 'bloomnu.com', n: 'Bloom Sparkling Energy', c: '#e0525d', site: 'bloomnu.com/products/sparkling-energy', product: 'Sparkling energy drink: zero sugar, natural caffeine, prebiotics, 10 calories',
      img: [`${BLOOM_IMG}shopify_JO12PK_01.jpg?v=1742415977&width=600`, `${BLOOM_IMG}shopify_RL12PK_01.jpg?v=1742415977&width=600`, `${BLOOM_IMG}shopify_CL12PK_01.jpg?v=1742415977&width=600`] },
    { h: 'drinkolipop.com', n: 'Olipop', c: '#2b9a7a', site: 'drinkolipop.com', product: 'Prebiotic soda' },
    { h: 'drinkpoppi.com', n: 'Poppi', c: '#d0861b', site: 'drinkpoppi.com', product: 'Prebiotic soda' },
    { h: 'culturepopsoda.com', n: 'Culture Pop', c: '#3d6fe0', site: 'culturepopsoda.com', product: 'Probiotic soda' },
  ] satisfies Competitor[],
  beliefs: [
    { id: 'gut', s: 'Gut health, not hype', t: 'Feeling good should come from what’s inside the can.', vs: 'Competitors sell energy and buzz first.', ex: 'What 30 days of one can a day did for my gut.' },
    { id: 'taste', s: 'Taste first', t: 'A healthy soda still has to taste like a treat.', vs: 'Competitors lead with the ingredients list.', ex: 'Blind taste test: can you tell it’s 40 calories?' },
    { id: 'story', s: 'Flavours with a story', t: 'Flavours like yuzu, lychee and guava deserve their story.', vs: 'Competitors stick to cherry and lemon-lime.', ex: 'Where yuzu comes from, in 20 seconds.' },
    { id: 'nocrash', s: 'No crash', t: 'You shouldn’t need caffeine to feel good at 3pm.', vs: 'Energy drinks pack caffeine into every can.', ex: 'My 3pm swap: no caffeine, no crash.' },
  ] satisfies Belief[],
  // Whole-niche formats: [name, caption, icon, belief ids]
  formats: [
    ['Blind taste test', 'Can you guess which one is 40 calories?', 'can', ['taste']],
    ['Flavour ranking', 'Every flavour, ranked', 'grid', ['taste', 'story']],
    ['3pm swap', 'My 3pm swap: no caffeine, no crash', 'spark', ['nocrash', 'gut']],
    ['Ingredient story', 'Where yuzu comes from, in 20 seconds', 'book', ['story']],
    ['Fridge restock', 'Restocking my fridge for the week', 'grid', ['gut']],
    ['30-day test', '30 days of one can a day', 'chart', ['gut']],
  ] as [string, string, IconName, string[]][],
};

// Saved snapshot of drinkwildwonder.com (the example client), used when the live site rate-limits us.
const WW = 'https://drinkwildwonder.com/cdn/shop/files/';
const wwProduct = (handle: string, title: string, images: string[]): Product =>
  ({ id: handle, title, url: `https://drinkwildwonder.com/products/${handle}`, images: images.map(f => WW + f), selected: false, imported: true });
export const WILD_WONDER: SiteInfo = {
  host: 'drinkwildwonder.com',
  title: 'Prebiotic + probiotic sparkling drink for a happy gut',
  description: 'Try the world’s first prebiotic+probiotic sparkling drink. Organic, vegan, low sugar, and just 40 calories.',
  socials: { tiktok: '@drinkwildwonder', instagram: '@drinkwildwonder' },
  source: 'saved',
  products: [
    wwProduct('apple-yuzu', 'Apple Yuzu', ['Apple_1B_420x.jpg?v=1785538613', 'Apple_3_420x.jpg?v=1785538613']),
    wwProduct('pink-pomelo-limeade', 'Pink Pomelo Limeade', ['Pomelo_1B_420x.jpg?v=1784029065', 'Pomelo_3_517d46ba-2b27-434e-ab86-64500125db7e_420x.jpg?v=1784029065']),
    wwProduct('cherry-lemonade', 'Cherry Lemonade', ['Cherry_1B_420x.jpg?v=1784029141', 'Cherry_3_420x.jpg?v=1784029141']),
    wwProduct('raspberry-lychee', 'Raspberry Lychee', ['Raspberry_1B_420x.jpg?v=1784029237', 'Raspberry_3_420x.jpg?v=1784029237']),
    wwProduct('strawberry-passion', 'Strawberry Passion', ['Strawberry_1B_420x.jpg?v=1784029323', 'Strawberry_3_420x.jpg?v=1784029323']),
    wwProduct('guava-rose', 'Guava Rose', ['Guava_1B_420x.jpg?v=1784029391', 'Guava_3_420x.jpg?v=1784029391']),
    wwProduct('pineapple-paradise', 'Pineapple Paradise', ['Pineapple_1B_420x.jpg?v=1784029459', 'Pineapple_3_420x.jpg?v=1784029458']),
    wwProduct('mango-gold', 'Mango Gold', ['Mango_1B_420x.jpg?v=1784029529', 'Mango_3_420x.jpg?v=1784029529']),
    wwProduct('blackberry-violet', 'Blackberry Violet', ['Blackberry_1B_c3b073bf-ad6f-4db3-933c-2e040a6fe090_420x.jpg?v=1784028951']),
    wwProduct('very-berry', 'Very Berry', ['VeryBerry_1B_d4e5365f-d971-467e-b82e-79d4e275d668_420x.jpg?v=1784094153', 'VeryBerry_3_420x.jpg?v=1784029762']),
    wwProduct('variety-pack', 'Variety Pack', ['ClassicVariety_1B_4bd99b89-42d1-4a74-8952-5eb01f0be313_420x.jpg?v=1784094151', 'ClassicVariety_3_420x.jpg?v=1784029716']),
  ],
};

export const PALETTE = ['#e0525d', '#2b9a7a', '#d0861b', '#3d6fe0'];
export const FORMAT_COLORS: [string, string][] = [['#1e1b4b', '#7c3aed'], ['#831843', '#f472b6'], ['#14532d', '#84cc16'], ['#0c4a6e', '#22d3ee'], ['#7c2d12', '#fb923c'], ['#27272a', '#a1a1aa']];
