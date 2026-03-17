export const SHOT_TYPES = [
  'Full Drive', 'Fairway Wood', 'Long Iron (2-4)', 'Mid Iron (5-7)',
  'Short Iron (8-9)', 'Pitch Shot', 'Chip Shot', 'Bunker Shot', 'Flop Shot', 'Putt'
]

export const GRIP_TYPES = [
  'Overlapping (Vardon)', 'Interlocking', 'Baseball (10-Finger)',
  'Strong Grip', 'Neutral Grip', 'Weak Grip'
]

export const SKILL_LEVELS = [
  'Complete Beginner', 'Beginner', 'Intermediate', 'Advanced', 'Expert'
]

export const PRO_GOLFERS = [
  { name: 'Tiger Woods',    style: 'Power & Precision',      desc: 'Aggressive downswing, strong leg drive, iconic follow-through' },
  { name: 'Rory McIlroy',  style: 'Athletic Power',          desc: 'High backswing, explosive hip rotation, effortless speed' },
  { name: 'Annika Sorenstam', style: 'Consistency & Control', desc: 'Forward head position, methodical tempo, elite ball-striking' },
  { name: 'Ben Hogan',     style: 'Classic Technique',       desc: 'Supinated left wrist, flat left foot, textbook impact position' },
  { name: 'Sam Snead',     style: 'Smooth Tempo',            desc: 'Ultra-fluid swing, perfect rhythm, minimal effort maximum power' },
  { name: 'Jack Nicklaus', style: 'Powerful & Deliberate',   desc: 'High right elbow, strong leg action, careful pre-shot routine' },
  { name: 'Ernie Els',     style: 'Big Easy Tempo',          desc: 'Silky smooth transition, effortless power, excellent balance' },
  { name: 'Lydia Ko',      style: 'Technical Precision',     desc: 'Compact backswing, excellent impact position, consistent flight' },
  { name: 'Jon Rahm',      style: 'Compact & Powerful',      desc: 'Short backswing, fast hip clearance, elite ball-striking' },
  { name: 'Dustin Johnson', style: 'Bowed Wrist Power',      desc: 'Bowed left wrist at top, deep hip rotation, massive distance' },
{ name: 'Moe Norman', style: 'Single Plane Perfection', desc: 'The most technically perfect swing ever — single plane, zero wasted movement, robotically consistent ball-striking' },
  { name: 'Fred Couples', style: 'Effortless Power', desc: 'Ultra-loose flowing tempo with silky transition — looks barely trying yet generates enormous power' },
  { name: 'Payne Stewart', style: 'Classic Elegance', desc: 'Textbook classic swing with beautiful rhythm, full shoulder turn, and perfectly balanced finish' },
  { name: 'Rickie Fowler', style: 'Modern Athletic', desc: 'Open stance, strong grip, explosive through-swing — popular with younger golfers for his athletic modern style' },
  { name: 'Adam Scott', style: 'Picture Perfect', desc: 'Widely considered the most beautiful modern swing — perfect tempo, gorgeous follow-through, textbook in every position' },
  { name: 'Steve Stricker', style: 'Simple & Repeatable', desc: 'Minimal moving parts, quiet lower body, incredibly consistent — perfect model for beginners wanting simplicity' },
  { name: 'Seve Ballesteros', style: 'Creative Genius', desc: 'Magical feel and creativity — unmatched short game imagination and recovery shot brilliance' },
  { name: 'Tom Watson', style: 'Timeless Technique', desc: 'Classic fundamentals with aggressive putting — one of the most complete players and ball-strikers in history' },]

export const GRIPS = [
  {
    name: 'Overlapping (Vardon)', emoji: '🤝',
    whoFor: 'Most common grip. Best for medium to large hands. The recommended starting point for most adult beginners.',
    howTo: '1. Place left hand on club with handle across fingers\n2. Left thumb points slightly right of center\n3. Right pinky overlaps gap between left index and middle finger\n4. Both V\'s point between chin and right shoulder',
    pros: '✅ Unifies hands • Reduces right hand dominance • Most widely taught',
    cons: '❌ Can feel awkward for small hands • Takes time to build muscle memory',
    users: 'Tiger Woods, Rory McIlroy, Dustin Johnson',
    youtube: 'Vardon overlap grip golf tutorial'
  },
  {
    name: 'Interlocking', emoji: '🔗',
    whoFor: 'Ideal for smaller hands or shorter fingers. Great for beginners, juniors, and women golfers.',
    howTo: '1. Set up left hand same as Vardon grip\n2. Interlock right pinky with left index finger — they weave together\n3. Remaining fingers wrap around grip normally\n4. Both V\'s point between chin and right shoulder',
    pros: '✅ Very unified hand connection • Great for smaller hands • Feels secure',
    cons: '❌ Can cause finger tension • Some find it uncomfortable at first',
    users: 'Jack Nicklaus, Tiger Woods (uses both), Rory McIlroy (junior years)',
    youtube: 'interlocking grip golf beginner'
  },
  {
    name: 'Baseball (10-Finger)', emoji: '⚾',
    whoFor: 'Best for juniors, complete beginners, seniors with arthritis, or anyone with small hands or weak grip strength.',
    howTo: '1. All 10 fingers on the club — no overlapping\n2. Left hand at top, right hand directly below\n3. Right pinky sits next to (not on) left index finger\n4. Both palms face each other, thumbs down shaft',
    pros: '✅ Most natural feel • Maximum grip security • Less hand fatigue',
    cons: '❌ Hands can work independently causing inconsistency',
    users: 'Many junior golfers, Bob Estes',
    youtube: '10 finger baseball golf grip tutorial'
  },
  {
    name: 'Strong Grip', emoji: '💪',
    whoFor: 'For golfers who slice the ball. Rotating hands right helps close the clubface and promote a draw.',
    howTo: '1. Start with normal grip\n2. Rotate left hand clockwise until you see 3-4 knuckles\n3. Left thumb sits right of center\n4. Match right hand by rotating slightly clockwise\n5. V\'s point to right shoulder or beyond',
    pros: '✅ Promotes draw ball flight • Closes clubface • Good for slicers',
    cons: '❌ Can cause hooks if overdone',
    users: 'Dustin Johnson (extreme), Zach Johnson',
    youtube: 'strong golf grip fix slice draw'
  },
  {
    name: 'Neutral Grip', emoji: '⚖️',
    whoFor: 'The textbook starting point. 2 knuckles visible. Ideal for developing proper fundamentals.',
    howTo: '1. Hold club so 2 knuckles are visible looking down\n2. Left thumb points slightly right of center\n3. Right palm faces target\n4. Right thumb sits left of center\n5. V\'s point between chin and right shoulder',
    pros: '✅ Balanced ball flight • Works for all shot shapes • Best starting point',
    cons: '❌ Won\'t automatically fix existing ball flight issues',
    users: 'Most tour pros as their base, Ben Hogan, Ernie Els',
    youtube: 'neutral golf grip fundamentals'
  },
  {
    name: 'Weak Grip', emoji: '🎯',
    whoFor: 'For players who hook the ball. Rotating hands left opens the clubface slightly to promote a fade.',
    howTo: '1. Start with normal grip\n2. Rotate left hand counter-clockwise until only 1 knuckle visible\n3. Left thumb sits left of center\n4. Match right hand counter-clockwise\n5. V\'s point toward chin or left of chin',
    pros: '✅ Promotes fade • Helps control hooks',
    cons: '❌ Reduces power potential',
    users: 'Lee Trevino, Paul Azinger, Collin Morikawa',
    youtube: 'weak golf grip fix hook fade'
  },
]

export const SHOTS = [
  {
    name: 'Full Drive', emoji: '🚀', club: 'Driver (1-wood)',
    when: 'Tee box of par-4s and par-5s when you need maximum distance.',
    tips: '• Tee ball high — half the ball above clubhead\n• Ball position off front heel\n• Sweep up through ball, don\'t hit down\n• Wide stance — shoulder width\n• Full shoulder turn on backswing',
    mistakes: 'Teeing too low • Swinging too hard • Standing too close • Open clubface causing slice',
    youtube: 'how to hit driver for beginners'
  },
  {
    name: 'Fairway Wood', emoji: '🌲', club: '3-wood or 5-wood',
    when: 'Long shots from the fairway, or off tee when accuracy matters more than distance.',
    tips: '• Ball 2 inches inside front heel\n• Sweep ball off turf, minimal divot\n• Keep head still through impact\n• Full swing, controlled tempo',
    mistakes: 'Trying to scoop ball up • Swinging too steeply • Ball too far forward',
    youtube: 'how to hit fairway wood tips'
  },
  {
    name: 'Mid Iron (5-7)', emoji: '🎯', club: '5, 6, or 7 iron',
    when: 'Approach shots 130-170 yards. The bread-and-butter of golf.',
    tips: '• Ball just forward of center\n• Aim to take a small divot in front of ball\n• 80% swing speed for control\n• Hips clear through impact',
    mistakes: 'Decelerating through impact • Too much hand action • Swaying',
    youtube: 'mid iron approach shot tips golf'
  },
  {
    name: 'Short Iron (8-9)', emoji: '📍', club: '8 or 9 iron',
    when: 'Scoring shots from 100-130 yards. This is where birdies are made.',
    tips: '• Ball slightly back of center\n• Steeper angle of attack\n• Take a confident divot\n• Focus on landing spot, not the flag',
    mistakes: 'Scooping • Standing too close • Deceleration',
    youtube: 'short iron golf approach shot accuracy'
  },
  {
    name: 'Pitch Shot', emoji: '🏹', club: 'Pitching wedge or gap wedge',
    when: '50-100 yard shots requiring loft and soft landing.',
    tips: '• Narrow stance\n• Ball center or slightly back\n• Hands ahead at address\n• Accelerate through impact — never decelerate\n• Match backswing length to distance',
    mistakes: 'Decelerating • Scooping with hands • Too wide stance',
    youtube: 'pitch shot technique golf wedge'
  },
  {
    name: 'Chip Shot', emoji: '🎳', club: '7-iron to lob wedge',
    when: 'Short shots around the green — within 30 yards, needing low running shot.',
    tips: '• Very narrow stance\n• Lean shaft and weight toward target\n• Ball back in stance\n• Minimize wrist action — rock the shoulders\n• Think: little air time, lots of roll',
    mistakes: 'Too much wrist flip • Ball too far forward • Lifting head early',
    youtube: 'chipping technique for beginners golf'
  },
  {
    name: 'Bunker Shot', emoji: '🏖️', club: 'Sand wedge (56°)',
    when: 'Escaping greenside sand traps.',
    tips: '• Open stance AND clubface before gripping\n• Aim 2 inches BEHIND the ball\n• Take a full, aggressive swing\n• Sand does the work — don\'t hit ball directly\n• Follow through completely — this is critical!\n• Dig feet in for stability',
    mistakes: 'Decelerating through sand • Hitting ball directly • Closed clubface',
    youtube: 'bunker shot technique sand trap golf'
  },
  {
    name: 'Putt', emoji: '🕳️', club: 'Putter',
    when: 'On the green. 40% of all golf strokes are putts — most important skill!',
    tips: '• Eyes directly over the ball\n• Stroke like a pendulum — shoulders rock, no wrists\n• Accelerate through the putt\n• Read the green: slope, grain, speed\n• Short putts: aim for back of cup\n• Long putts: focus on distance, not line',
    mistakes: 'Decelerating • Looking up too early • Too much wrist movement',
    youtube: 'putting technique for beginners golf'
  },
]

export const FREE_ANALYSES_PER_MONTH = 3

export const DAILY_TIPS = [
  '💡 Practice your grip for 5 minutes daily — it\'s the only connection you have with the club.',
  '💡 80% of amateur golfers slice because of an open clubface at impact. Check your grip first.',
  '💡 Tempo is everything. Try humming a waltz: 1-2-3 back, 1 through.',
  '💡 The best drill for beginners: chip with your 7-iron for 20 minutes before anything else.',
  '💡 Stand closer to the ball than feels comfortable — most beginners stand too far away.',
  '💡 Keep your head still, not down. Watch the ball, but don\'t force your chin to your chest.',
  '💡 Swing at 70% power. Slower, smoother swings go farther than hard ones.',
  '💡 Fix your ball marks on the green — it\'s golf etiquette and earns instant respect.',
  '💡 The best mental tip: give yourself 10 seconds to be frustrated, then let it go.',
  '💡 Course management wins more strokes than distance. Play to the fat part of the green.',
]
