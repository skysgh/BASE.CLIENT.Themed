/**
 * Monthly Price
 */
const system_PriceSize = [
  {
    id: '00000000-00000000-00000000-00000001',
    title: 'Single',
    description: ''
  },
  {
    id: '00000000-00000000-00000000-00000002',
    title: 'Small',
    description: 'For small, tight, teams ready to take on the world.'

  },
  {
    id: '00000000-00000000-00000000-00000003',
    title: 'Medium',
    description: 'For smooth running teams.'

  },
  {
    id: '00000000-00000000-00000000-00000004',
    title: 'Enterprise',
    description: 'For unignorable organisations.'

  },
  {
    id: '00000000-00000000-00000000-00000005',
    title: 'Unlimited',
    description: 'For uninteruptible service (AND 2 months every year free!).'

  }
]

const MonthlyPlan = [
  {
    id: '00000000-00000000-00000000-00000001',
    title: "Scout",
    description: "For self-reliants setting out for new worlds.",
    iconId: "ri-book-mark-line",
    ribbon: false,
    rate: 1.99,
    members: 1, 
    partners: 3,
    groups: 6,
    projects: 9,
    resources: 89,
    supportClass: "danger",
    supportClassSymbol: "close",
    storageClass: "danger",
    storageClassSymbol: "close",
    domainClass: "danger",
    domainClassSymbol: "close",
    planButtonClassname: "danger"
  },
  {
    id: '00000000-00000000-00000000-00000002',
    title: "Mousescetair",
    description: "For small tight teams working as one.",
    iconId: "ri-medal-line",
    ribbon: false,
    rate: 4.99,
    members: 1,
    partners: 3,
    groups: 6,
    projects: 9,
    resources: 89,
    supportClass: "success",
    supportClassSymbol: "checkbox",
    storageClass: "danger",
    storageClassSymbol: "close",
    domainClass: "danger",
    domainClassSymbol: "close",
    planButtonClassname: "info"
  },
  {
    id: '00000000-00000000-00000000-00000003',
    title: "Mighty",
    description: "For efficient teams taking on the world.",
    iconId: "ri-stack-line",
    ribbon: true,
    rate: 39,
    members: 1,
    partners: 3,
    groups: 6,
    projects: 9,
    resources: 89,
    supportClass: "success",
    supportClassSymbol: "checkbox",
    storageClass: "success",
    storageClassSymbol: "checkbox",
    domainClass: "danger",
    domainClassSymbol: "close",
    planButtonClassname: "info"
  },
  {
    id: '00000000-00000000-00000000-00000004',
    title: "The Big E",
    description: "For juggernauts changing the world.",
    iconId: "ri-stack-line",
    ribbon: false,
    rate: 499,
    members: 1,
    partners: 3,
    groups: 6,
    projects: 9,
    resources: 89,
    supportClass: "success",
    supportClassSymbol: "checkbox",
    storageClass: "success",
    storageClassSymbol: "checkbox",
    domainClass: "danger",
    domainClassSymbol: "close",
    planButtonClassname: "info"
  },
  {
    id: '00000000-00000000-00000000-00000005',
    title: "Unstoppable",
    description: "For optimize web queries.",
    iconId: "ri-stack-line",
    rate: 49,
    ribbon: false,
    members: 1,
    partners: 3,
    groups: 6,
    projects: 9,
    resources: 89,
    supportClass: "success",
    supportClassSymbol: "checkbox",
    storageClass: "success",
    storageClassSymbol: "checkbox",
    domainClass: "success",
    domainClassSymbol: "checkbox",
    planButtonClassname: "info"
  }
]

/**
 * Yearly Price
 */

const YearlyPlan = [
  {
    id: '00000000-00000000-00000000-00000001',
    title: "Scout",
    description: "The perfect way to get started and get used to our tools.",
    iconId: "ri-stack-line",
    rate: 123,
    price: 171,
    ribbon: false,
    members: 1,
    partners: 3,
    groups: 6,
    projects: 9,
    resources: 89,
    supportClass: "danger",
    supportClassSymbol: "close",
    storageClass: "danger",
    storageClassSymbol: "close",
    domainClass: "danger",
    domainClassSymbol: "close",
    planButtonClassname: "danger"
  },
  {
    id: '00000000-00000000-00000000-00000002',
    title: "Musketeers",
    description: "Excellent for scalling teams to build culture. Special plan for professional business.",
    iconId: "ri-stack-line",
    rate: 261,
    price: 348,
    ribbon: false,
    members: 1,
    partners: 3,
    groups: 6,
    projects: 9,
    resources: 89,
    supportClass: "info",
    supportClassSymbol: "checkbox",
    storageClass: "danger",
    storageClassSymbol: "close",
    domainClass: "danger",
    domainClassSymbol: "close",
    planButtonClassname: "info"
  },
  {
    id: '00000000-00000000-00000000-00000003',
    title: "Mighty",
    description: "This plan is for those who have a team alredy and running a large business.",
    iconId: "ri-stack-line",
    rate: 123,
    price: 468,
    members: 1,
    partners: 3,
    groups: 6,
    projects: 9,
    resources: 89,
    supportClass: "success",
    supportClassSymbol: "checkbox",
    storageClass: "success",
    storageClassSymbol: "checkbox",
    domainClass: "danger",
    domainClassSymbol: "close",
    ribbon: true,
    planButtonClassname: "info"
  },
  {
    id: '00000000-00000000-00000000-00000004',
    iconId: "ri-stack-line",
    title: "Unstoppable",
    description: "For most businesses that want to optimize web queries.",
    rate: 123,
    price: 588,
    ribbon: false,
    members: 1,
    partners: 3,
    groups: 6,
    projects: 9,
    resources: 89,
    supportClass: "success",
    supportClassSymbol: "checkbox",
    storageClass: "success",
    storageClassSymbol: "checkbox",
    domainClass: "success",
    domainClassSymbol: "checkbox",
    planButtonClassname: "info"
  },
]




export { MonthlyPlan, YearlyPlan};
