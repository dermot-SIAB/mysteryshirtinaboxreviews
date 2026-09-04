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
  long: 'Mystery Shirt in a Box owns and runs this site. We built it so you can read what real customers say in one place, without hunting through pages of a review platform. Every quote is copied word for word from a public Trustpilot review, including typos, and we link to the source so you can check for yourself. We feature 4 and 5 star reviews here. The overall Trustpilot score, including the critical reviews, is shown at the bottom of every page, and you can read all of them on Trustpilot.',
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
      'Thinking about ordering a mystery football or rugby shirt and want to know what actually turns up? This page collects real Mystery Shirt in a Box reviews from customers in the UK and Ireland, copied word for word from Trustpilot, with a link to every source.',
      'The short version from the people who have bought one: the shirts are good quality, the clubs are often ones you have never heard of (that is the point, and the reviews are split on whether they love it), delivery is quick, and customer service gets a lot of praise by name. Sizing runs small on some shirts, and exchanges are the usual fix.',
    ],
    filter: r => r.rating === 5,
    limit: 12,
    sections: [
      { h2: 'What people say most often', body: [
        'Read enough of these and the same themes come up. Quality gets mentioned more than anything else. Speed of delivery is close behind, with several reviews surprised that a shirt ordered on a Thursday arrived on the Monday. Customer service is praised by name, usually Leona, for sorting sizing and preference changes within hours. And the mystery itself divides people: most reviewers enjoy getting a club they have never heard of, and a minority would like a big name occasionally.',
        'We have grouped the reviews by topic so you can go straight to what you care about: football, rugby, the subscription, gifts, or delivery and service.',
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
      'Yes. Mystery Shirt in a Box is a real UK-based company that ships football and rugby shirts from its warehouse, has thousands of public reviews on Trustpilot, and offers a 30 day returns and exchange window. It is not a scam. Whether it is right for you depends on how you feel about the mystery part.',
      'This page is run by the company, so read it with that in mind. To keep it honest we quote reviews word for word, link every one to its source, and show the overall Trustpilot score at the bottom of the page including the one star reviews. You can read every review on Trustpilot.',
    ],
    filter: r => r.topics.includes('legit') || r.topics.includes('quality') || r.topics.includes('exchange'),
    limit: 8,
    sections: [
      { h2: 'What the critical reviews are about', body: [
        'About a quarter of Trustpilot reviews are one star, and it would be odd to pretend otherwise. They mostly fall into four groups. First, people who received a shirt from a club they had never heard of and felt it was not worth the price. Second, sizing, because manufacturers cut differently and some shirts run small. Third, the subscription, where the two box minimum was not clear to the buyer before they signed up. Fourth, delivery timing, especially around Christmas and for Northern Ireland.',
        'The positive reviews on this page mention the same things and land differently: the obscure club is the fun of it, the exchange sorted the size, the second box was worth it, the delay was fixed within the hour. Same product, different expectations. If you want a shirt from a club you already support, this is not the product for you. If you like the idea of a shirt nobody else in the pub has, the reviews suggest you will be happy.',
      ]},
      { h2: 'What the company actually promises', body: [
        'Shirts are genuine club shirts, and if one misses the mark you can exchange it within 30 days (the exchange is free; you cover return postage on taste based swaps, and team preference swaps are honoured once). You can exclude up to three leagues or nations you do not want. The subscription has a two box minimum, then you can cancel whenever you like. UK delivery is tracked Royal Mail and takes about 48 hours from leaving the warehouse. If it is a gift, order at least a week ahead.',
      ]},
    ],
    faq: [
      { q: 'Is Mystery Shirt in a Box a scam?', a: 'No. It is a real UK company with thousands of public Trustpilot reviews, a 30 day returns and exchange policy, and a customer service team that reviewers praise by name. This site is run by the company; you can read every review, including critical ones, on Trustpilot.' },
      { q: 'Are the shirts real?', a: 'Customers describe them as genuine club shirts, often from clubs they had never heard of. If a shirt misses the mark you can exchange it within 30 days.' },
      { q: 'Why are there one star reviews?', a: 'Mostly because the mystery club was too obscure for the buyer, the shirt ran small, the subscription two box minimum was not understood, or delivery was slow at Christmas. The positive reviews describe the same things as the fun of it or as problems that were fixed quickly.' },
      { q: 'Can I cancel the subscription?', a: 'Yes, after the two box minimum. Cancel whenever you like after your second box.' },
    ],
    cta: { label: 'Visit the Mystery Shirt in a Box shop', shop: 'home' },
  },
  {
    path: '/football-shirt-reviews/',
    title: 'Mystery Football Shirt Reviews | What UK Customers Received',
    description: 'Mystery football shirt reviews from UK and Irish customers: clubs received, quality, fit and whether they ordered again. Word for word from Trustpilot.',
    h1: 'Mystery football shirt reviews',
    intro: [
      'These are real reviews of the mystery football shirt box, quoted word for word. Customers mention Crotone, San Francisco City, Guyana, Samsunspor, lower league Spanish and Australian clubs, and plenty of teams they had to look up. Quality and fit come up most.',
    ],
    filter: r => r.topics.includes('football'),
    limit: 30,
    sections: [
      { h2: 'What to expect from the shirt', body: [
        'The recurring line is some version of "a team I have never heard of, and it is actually a great shirt". The box comes with an info card about the club, which several reviewers say is their favourite part. On sizing, more than one reviewer says the shirts run small and recommends going up a size or using the exchange. You can exclude up to three leagues or nations before you order.',
      ]},
    ],
    cta: { label: 'See the mystery football shirt box', shop: 'football' },
  },
  {
    path: '/rugby-shirt-reviews/',
    title: 'Mystery Rugby Shirt Reviews | UK Customer Reviews',
    description: 'Mystery rugby shirt reviews from UK and Irish customers: quality, fit for bigger builds, obscure clubs and the quarterly subscription. From Trustpilot.',
    h1: 'Mystery rugby shirt reviews',
    intro: [
      'Fewer people write about the rugby box than the football one, so these reviews are worth reading closely. Customers talk about French semi pro clubs, Italian sides, "wonderfully obscure" teams, the quarterly delivery rhythm, and fit for bigger builds.',
    ],
    filter: r => r.topics.includes('rugby'),
    limit: 20,
    sections: [
      { h2: 'Rugby specifics', body: [
        'The rugby subscription delivers every three months rather than monthly, which reviewers mention as a plus. The clubs tend to be from outside the UK, and the reviews on this page treat that as the appeal. As with football, if you only want your own club, this is not the box for you.',
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
      'The subscription is where the strongest opinions live, in both directions. Here are reviews from customers who have had two, three, seven and thirteen shirts, quoted word for word. One thing to know before you sign up: there is a two box minimum, and after that you can cancel whenever you like. The reviews that mention cancellation trouble are almost always from people who did not know that.',
    ],
    filter: r => r.topics.includes('subscription'),
    limit: 30,
    sections: [
      { h2: 'The two box minimum, plainly', body: [
        'When you start a subscription you commit to two boxes. After the second one ships you can cancel at any time. That is the whole rule. We are stating it here because the company’s own critical reviews show it catches people out, and a review site that hid it would not be much use to you.',
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
      'A lot of boxes are bought for someone else. These reviews are from people who gave one to a son, a partner, a teenage godson or a son in law, quoted word for word. The practical tip that comes out of them: order at least a week ahead of the date, and if you want the box to arrive unbranded, email the company and ask for the plain black mailer.',
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
      'Customer service is the most consistently praised part of the whole experience, often by name. These reviews cover delivery speed (Thursday to Monday is a common story), what happened when a parcel was delayed, and how sizing swaps and preference changes were handled.',
    ],
    filter: r => r.topics.includes('delivery') || r.topics.includes('service') || r.topics.includes('exchange'),
    limit: 30,
    sections: [
      { h2: 'What the company says about delivery', body: [
        'UK orders go tracked Royal Mail and the company quotes about 48 hours from the parcel leaving the warehouse. Picking the shirt can add time before dispatch, which a couple of reviewers mention. Northern Ireland tends to add a day or two. Around Christmas, order early.',
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
      'Every review we feature on this site, in one list. Each one is a real 4 or 5 star Trustpilot review, copied word for word, with the reviewer’s display name, country and the date it was published. For the complete picture including critical reviews, use the Trustpilot link at the bottom of the page.',
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
      'Short answers, based on the company’s published policies and what reviewers report. Where a policy page and a marketing page disagree, we go with the policy page.',
    ],
    filter: () => false,
    limit: 0,
    sections: [],
    faq: [
      { q: 'What is Mystery Shirt in a Box?', a: 'A UK company that sends you a football or rugby shirt you did not choose. You pick your size and exclude up to three leagues or nations you do not want; they pick the shirt. It comes as a one off or as a subscription.' },
      { q: 'What if the shirt does not fit?', a: 'You have 30 days to return or exchange. The exchange itself is free. For a swap based on taste rather than an error, you cover the return postage, and team preference swaps are honoured once. Tags need to be on. Several reviewers say the shirts run small, so consider sizing up.' },
      { q: 'Can I choose the team?', a: 'No, that is the mystery. You can exclude up to three leagues or nations, name teams you do not want, and add free text preferences.' },
      { q: 'How do I cancel the subscription?', a: 'There is a two box minimum. After your second box ships you can cancel whenever you like.' },
      { q: 'How long does delivery take?', a: 'UK orders are tracked Royal Mail and take about 48 hours from leaving the warehouse. Picking the shirt can add time before dispatch. If it is a gift, order at least a week ahead.' },
      { q: 'Can it be sent as a gift without spoiling the surprise?', a: 'Yes. Email the company after ordering and ask for the plain black mailer bag. It is on request, not automatic.' },
      { q: 'Did Gary Neville really have one?', a: 'Yes. He had a box and liked it. It was not a paid partnership.' },
      { q: 'Who runs this reviews site?', a: 'Mystery Shirt in a Box does. Every quote is a real Trustpilot review copied word for word and linked to its source, and the overall Trustpilot score including critical reviews is shown on every page.' },
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
        'We feature 4 and 5 star reviews from the public Trustpilot profile. We do not edit them: spelling, grammar and emoji stay as the customer wrote them, because cleaned up quotes read like marketing wrote them. We do not pay for reviews, and we do not remove critical reviews from Trustpilot; they are there for you to read.',
        'We leave out reviews that are not really about a purchase (for example giveaway winners) and reviews where quoting them publicly would not be fair to the person who wrote them.',
      ]},
      { h2: 'How we handle the overall score', body: [
        'The footer of every page shows the current Trustpilot score and review count with the date we captured it, and a link to the profile. We do not publish a star rating badge or rating markup for search engines on this site, because a rating built only from the reviews we chose to feature would be misleading.',
      ]},
      { h2: 'Contact', body: [
        'Questions about an order go to the shop’s customer service team through mysteryshirtinabox.com. Spotted a quote on this site that does not match the Trustpilot original? Tell us the same way and we will fix it.',
      ]},
    ],
    cta: { label: 'Visit the shop', shop: 'home' },
  },
];
