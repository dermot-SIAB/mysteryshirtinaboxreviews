// Site configuration and hand-written page copy.
// Quotes come from content/reviews.json and are never edited here.

export const SITE = {
  name: 'Mystery Shirt in a Box Reviews',
  shortName: 'MSIAB Reviews',
  url: 'https://mysteryshirtinaboxreviews.com',
  language: 'en-GB',
  owner: 'Mystery Shirt in a Box',
  ownerUrl: 'https://mysteryshirtinabox.com',
  trustpilotUrl: 'https://uk.trustpilot.com/review/mysteryshirtinabox.com',
  utm: { utm_source: 'mysteryshirtinaboxreviews.com', utm_medium: 'referral', utm_campaign: 'reviews-hub' },
};

export const DISCLOSURE = {
  short: 'This site is run by Mystery Shirt in a Box. Every quote is a real customer review, copied word for word from Trustpilot.',
  long: 'This site is owned and run by Mystery Shirt in a Box. We built it because our reviews were spread across pages and pages of Trustpilot and we wanted somewhere you could read them in one go. Every quote is copied word for word from a public Trustpilot review, typos included, and each one links to the Trustpilot profile so you can check it there. The reviews we feature here are 4 and 5 star. The overall Trustpilot score, critical reviews and all, sits at the bottom of every page, and you can read every review on Trustpilot.',
};

// path → shop destination (the UK store). Query string UTM added at build time.
export const SHOP = {
  home: '/',
  football: '/products/mystery-football-shirt',
  rugby: '/products/rugby-union-mystery-shirt',
  kids: '/products/kids-mystery-football-shirt',
  gift: '/pages/football-gift',
  headTerm: '/pages/football-shirt-mystery-box',
  rugbyPage: '/pages/mystery-rugby-shirt',
  returns: '/policies/refund-policy',
};

export const COUNTRY = { GB: 'UK', IE: 'Ireland', NL: 'Netherlands', NZ: 'New Zealand', AU: 'Australia', US: 'USA' };

export const NAV = [
  { href: '/is-mystery-shirt-in-a-box-legit/', label: 'Is it legit?' },
  { href: '/football-shirt-reviews/', label: 'Football' },
  { href: '/rugby-shirt-reviews/', label: 'Rugby' },
  { href: '/subscription-reviews/', label: 'Subscription' },
  { href: '/gift-reviews/', label: 'Gifts' },
  { href: '/delivery-and-customer-service-reviews/', label: 'Delivery & service' },
  { href: '/all-reviews/', label: 'All reviews' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/about/', label: 'About' },
];

// Pages. `filter` selects reviews by topic; `limit` caps how many render.
// Copy is plain UK English, answer-first, no invented facts.
export const PAGES = [
  {
    path: '/',
    title: 'Mystery Shirt in a Box Reviews | Real UK Customer Reviews',
    description: 'Real Mystery Shirt in a Box reviews from UK customers, quoted word for word from Trustpilot. Football, rugby, delivery, sizing and service.',
    h1: 'Mystery Shirt in a Box reviews, in customers’ own words',
    intro: [
      'If you are thinking about a mystery football or rugby shirt, you probably want to know what actually turns up. This page pulls together Mystery Shirt in a Box reviews from customers, mostly in the UK and Ireland. Each one is copied word for word from Trustpilot and linked to the Trustpilot profile.',
      'The short version. People rate the quality. The club is usually one you have never heard of, which is the whole idea, though not everyone loves it. Delivery is quick. Customer service gets praised a lot, often by name. On the downside, some shirts run small, and most people fix that with an exchange.',
    ],
    filter: r => r.rating === 5,
    limit: 12,
    sections: [
      { h2: 'What people say most often', body: [
        'Read a few dozen of these and you start seeing the same things. Quality comes up more than anything. Delivery speed is next, and one reviewer ordered on a Thursday and had the shirt by Monday. Customer service gets praised, often by name, for sorting size and preference changes within a few hours. The mystery bit splits people. Most like getting a club they have never heard of. A few would like a big name now and then.',
        'We have sorted the reviews by topic. If you only care about rugby, or about how quickly the parcel turns up, skip straight to that page.',
      ]},
    ],
    cta: { label: 'See the mystery football shirt box', shop: 'football' },
  },
  {
    path: '/is-mystery-shirt-in-a-box-legit/',
    title: 'Is Mystery Shirt in a Box Legit? Honest Answer + Reviews',
    description: 'Is Mystery Shirt in a Box legit? Yes. What customers say, the overall Trustpilot score including critical reviews, and the common complaints explained.',
    h1: 'Is Mystery Shirt in a Box legit?',
    intro: [
      'Yes. Mystery Shirt in a Box is a real company based in the UK. It ships football and rugby shirts from its own warehouse and has thousands of public reviews on Trustpilot. You get 30 days to return or exchange a shirt. It is not a scam. Whether you will actually like it is a different question, and that comes down to how you feel about not choosing the club.',
      'One thing to be upfront about: this site is run by the company. So read it knowing that. We quote every review word for word and link each one back to Trustpilot so you can check. The overall Trustpilot score, one star reviews included, is at the bottom of the page, and every review is there for you to read on Trustpilot itself.',
    ],
    filter: r => r.topics.includes('legit') || r.topics.includes('quality') || r.topics.includes('exchange'),
    limit: 8,
    sections: [
      { h2: 'What the critical reviews are about', body: [
        'About a quarter of the Trustpilot reviews are one star. No point pretending otherwise. Most of them are about one of four things. Someone got a club they had never heard of and did not think it was worth the money. The shirt ran small, because different manufacturers cut differently. The two box minimum on the subscription was not clear to them before they signed up. Or the parcel was late, usually at Christmas.',
        'The positive reviews on this page talk about exactly the same things. The difference is how they landed. For these customers the obscure club was the fun part, the exchange sorted the size, the second box turned out to be worth it, and the late parcel got chased up within the hour. If what you want is a shirt from the club you already support, buy one from the club. This is for people who like the idea of turning up to the pub in something nobody can place.',
      ]},
      { h2: 'What the company actually promises', body: [
        'The shirts are genuine club shirts. If you do not like the one you get, you have 30 days to exchange it. The exchange itself is free, but if you are swapping because you did not fancy the shirt rather than because of a mistake, you pay the return postage. Swaps for team preference are honoured once. Before you order you can rule out up to three leagues or nations. The subscription has a two box minimum, and after that you can cancel whenever you want. UK delivery is tracked Royal Mail and takes about 48 hours from the moment it leaves the warehouse. If it is a gift, order at least a week before you need it.',
      ]},
    ],
    faq: [
      { q: 'Is Mystery Shirt in a Box a scam?', a: 'No. It is a real UK company with thousands of public reviews on Trustpilot and a 30 day returns and exchange policy. Reviewers tend to praise the customer service team by name. This site is run by the company, and you can read every review, including the critical ones, on Trustpilot.' },
      { q: 'Are the shirts real?', a: 'Customers describe them as genuine club shirts, often from a club they had to look up. If you do not like yours you can exchange it within 30 days.' },
      { q: 'Why are there one star reviews?', a: 'Usually one of four things. The club was too obscure for the buyer. The shirt ran small. The two box minimum on the subscription was not understood. Or a parcel was slow at Christmas. The positive reviews mention the same things, but either as the fun of it or as problems that got fixed quickly.' },
      { q: 'Can I cancel the subscription?', a: 'Yes, once you have had your two boxes. There is a two box minimum, and after the second one you can cancel whenever you like.' },
    ],
    cta: { label: 'Visit the Mystery Shirt in a Box shop', shop: 'home' },
  },
  {
    path: '/football-shirt-reviews/',
    title: 'Mystery Football Shirt Reviews | What UK Customers Received',
    description: 'Mystery football shirt reviews from UK and Irish customers: clubs received, quality, fit and whether they ordered again. Word for word from Trustpilot.',
    h1: 'Mystery football shirt reviews',
    intro: [
      'These are reviews of the mystery football shirt box, quoted word for word. Crotone, San Francisco City, Guyana, Samsunspor, lower league Spanish and Australian sides, and a fair few clubs the reviewer had to google. Quality and fit come up most.',
    ],
    filter: r => r.topics.includes('football'),
    limit: 30,
    sections: [
      { h2: 'What to expect from the shirt', body: [
        'The line that comes up again and again is some version of "a team I have never heard of, and it is actually a great shirt". There is an info card about the club in the box, and a couple of reviewers say that is the best bit. On sizing, more than one person says the shirts run small and suggests going up a size, or just using the exchange. Before you order you can rule out up to three leagues or nations.',
      ]},
    ],
    cta: { label: 'See the mystery football shirt box', shop: 'football' },
  },
  {
    path: '/rugby-shirt-reviews/',
    title: 'Mystery Rugby Shirt Reviews | UK Customer Reviews',
    description: 'Mystery rugby shirt reviews from UK and Irish customers: quality, fit for bigger builds, obscure clubs and delivery every 3 months. From Trustpilot.',
    h1: 'Mystery rugby shirt reviews',
    intro: [
      'Fewer people write about the rugby box than the football one, so there is less to go on here and it is worth reading each one properly. Customers mention French semi pro clubs, Italian sides and "wonderfully obscure" teams. Fit for bigger builds comes up, and so does the fact that the box arrives every quarter rather than every month.',
    ],
    filter: r => r.topics.includes('rugby'),
    limit: 20,
    sections: [
      { h2: 'Rugby specifics', body: [
        'The rugby subscription can be set to arrive every three months rather than monthly, and the reviewers on that rhythm seem to like it. The clubs tend to be from outside the UK. The people writing these reviews see that as the point. If you only want your own club, same advice as for football: this is not the box for you.',
      ]},
    ],
    cta: { label: 'See the mystery rugby shirt', shop: 'rugby' },
  },
  {
    path: '/subscription-reviews/',
    title: 'Mystery Shirt in a Box Subscription Reviews | Worth It?',
    description: 'Is the Mystery Shirt in a Box subscription worth it? Reviews from customers on their 2nd, 7th and 13th shirt, plus the two box minimum explained plainly.',
    h1: 'Mystery Shirt in a Box subscription reviews',
    intro: [
      'The subscription gets the strongest opinions, good and bad. These are reviews from customers on their second, third, seventh and thirteenth shirt, quoted word for word. Before you sign up, know this: there is a two box minimum, and after that you can cancel whenever you like. Nearly every review that complains about cancelling is from someone who did not know about the minimum.',
    ],
    filter: r => r.topics.includes('subscription'),
    limit: 30,
    sections: [
      { h2: 'The two box minimum, plainly', body: [
        'When you start a subscription you are committing to two boxes. Once the second one has shipped you can cancel at any time. There is nothing more to it than that. We are spelling it out because the company’s own critical reviews show it catches people out, and a reviews site that buried it would not be much use to you.',
      ]},
    ],
    cta: { label: 'See subscription options', shop: 'football' },
  },
  {
    path: '/gift-reviews/',
    title: 'Mystery Shirt in a Box Gift Reviews | Sons, Partners, More',
    description: 'Reviews from people who bought a mystery football or rugby shirt as a gift for a son, partner, godson or son in law. Delivery timing tips included.',
    h1: 'Mystery shirt gift reviews',
    intro: [
      'A lot of these boxes are bought for someone else. The reviews here are from people who gave one to a son, a partner, a teenage godson or a son in law, quoted word for word. Two practical things come out of them. Order at least a week before the day. And if you do not want the packaging to give the surprise away, email the company after ordering and ask for the plain black mailer.',
    ],
    filter: r => r.topics.includes('gift'),
    limit: 20,
    sections: [],
    cta: { label: 'See football gift ideas', shop: 'gift' },
  },
  {
    path: '/delivery-and-customer-service-reviews/',
    title: 'Mystery Shirt in a Box Delivery & Service Reviews',
    description: 'How fast does Mystery Shirt in a Box deliver, and how good is the support? Real reviews on delivery times, exchanges and replies, quoted from Trustpilot.',
    h1: 'Delivery and customer service reviews',
    intro: [
      'Customer service is the thing reviewers praise most consistently, and they often name the person who helped. These reviews cover how fast the parcel arrived (one ordered on a Thursday and had it by Monday) and what happened when one was late. There are also a few on size swaps and preference changes.',
    ],
    filter: r => r.topics.includes('delivery') || r.topics.includes('service') || r.topics.includes('exchange'),
    limit: 30,
    sections: [
      { h2: 'What the company says about delivery', body: [
        'UK orders go tracked Royal Mail, and the company quotes about 48 hours from the parcel leaving the warehouse. Picking your shirt can add time before it is dispatched, which a couple of reviewers noticed. If you are ordering for Christmas, do it early.',
      ]},
    ],
    cta: { label: 'Visit the shop', shop: 'home' },
  },
  {
    path: '/all-reviews/',
    title: 'All Featured Mystery Shirt in a Box Reviews | Newest First',
    description: 'Every 4 and 5 star Mystery Shirt in a Box review featured on this site, newest first, with name, country and date. Quoted word for word from Trustpilot.',
    h1: 'All featured reviews, newest first',
    intro: [
      'Every review we feature on this site, in one list. Each is a 4 or 5 star Trustpilot review copied word for word, with the reviewer’s display name, country and the date it went up. For the full picture, critical reviews included, use the Trustpilot link at the bottom of the page.',
    ],
    filter: () => true,
    limit: 1000,
    sections: [],
    cta: { label: 'Visit the shop', shop: 'home' },
  },
  {
    path: '/faq/',
    title: 'Mystery Shirt in a Box FAQ | Sizing, Returns, Cancelling',
    description: 'Straight answers to the questions people ask before ordering a mystery shirt: sizing, exchanges, excluding teams, cancelling, gifts and delivery.',
    h1: 'Questions people ask before ordering',
    intro: [
      'Short answers, based on the company’s published policies and what reviewers say. Where a policy page and a marketing page disagree, we have gone with the policy page.',
    ],
    filter: () => false,
    limit: 0,
    sections: [],
    faq: [
      { q: 'What is Mystery Shirt in a Box?', a: 'A UK company that sends you a football or rugby shirt you did not pick. You choose your size and rule out up to three leagues or nations you do not want. They choose the shirt. You can buy one box on its own or take out a subscription.' },
      { q: 'What if the shirt does not fit?', a: 'You have 30 days to return or exchange it. The exchange itself is free. If you are swapping because you did not like the shirt, rather than because something went wrong, you pay the return postage. Team preference swaps are honoured once. Tags need to still be on. A few reviewers say the shirts run small, so think about going up a size.' },
      { q: 'Can I choose the team?', a: 'No, that is the whole point. What you can do is rule out up to three leagues or nations, name teams you do not want, and add a free text note about your preferences.' },
      { q: 'How do I cancel the subscription?', a: 'There is a two box minimum. Once your second box has shipped you can cancel whenever you like.' },
      { q: 'How long does delivery take?', a: 'UK orders go tracked Royal Mail and take about 48 hours from leaving the warehouse. Picking your shirt can add a bit of time before it is dispatched. If it is a gift, order at least a week ahead.' },
      { q: 'Can it be sent as a gift without spoiling the surprise?', a: 'Yes. Email the company after you order and ask for the plain black mailer bag. You do have to ask, it does not happen by default.' },
      { q: 'Did Gary Neville really have one?', a: 'Yes. He had a box and liked it. It was not a paid partnership.' },
      { q: 'Who runs this reviews site?', a: 'Mystery Shirt in a Box does. Every quote is a real Trustpilot review, copied word for word and linked to the Trustpilot profile. The overall Trustpilot score, critical reviews included, is on every page.' },
    ],
    cta: { label: 'Visit the shop', shop: 'home' },
  },
  {
    path: '/about/',
    title: 'About This Site | Run by Mystery Shirt in a Box',
    description: 'Who runs this site, where the reviews come from, how we choose which to feature, and why the overall Trustpilot score is on every page.',
    h1: 'About this site',
    intro: [DISCLOSURE.long],
    filter: () => false,
    limit: 0,
    sections: [
      { h2: 'How we choose reviews', body: [
        'We pick 4 and 5 star reviews from the public Trustpilot profile. We do not tidy them up. Spelling, grammar and emoji stay exactly as the customer typed them, because a cleaned up quote reads like something marketing wrote. The critical reviews are on Trustpilot for anyone to read.',
        'We leave out reviews that are not really about buying a shirt, giveaway winners for example, and any where quoting someone publicly would not be fair on them.',
      ]},
      { h2: 'How we handle the overall score', body: [
        'The footer on every page shows the current Trustpilot score and review count, the date we took it, and a link to the profile. We do not put an overall rating badge on this site or add rating markup for search engines, because a rating built only from the reviews we chose to show would be misleading. The stars on each card are that customer’s own rating.',
      ]},
      { h2: 'Contact', body: [
        'If it is about an order, go to the shop’s customer service team through mysteryshirtinabox.com. If you spot a quote on this site that does not match the Trustpilot original, tell us the same way and we will fix it.',
      ]},
    ],
    cta: { label: 'Visit the shop', shop: 'home' },
  },
];
