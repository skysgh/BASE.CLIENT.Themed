/**
 * Mock Pricing Data (Sites.Anon Tier)
 * 
 * ✅ CORRECT LOCATION: Business domain data belongs in sites tier
 * ❌ NOT in core tier (core = infrastructure only)
 * 
 * Temporary mock data for pricing plans until real API is implemented
 */

import { ServicePricingPlan } from '../../../core/models/data/service-pricing-plan.model';

export const MonthlyPlan: ServicePricingPlan[] = [
  {
    id: '1',
    title: 'Basic Plan',
    subtitle: 'For Startups',
    icon: 'ri-book-mark-line',
    rate: 19,
    projects: 3,
    customers: '299',
    bandwidth: 'Scalable Bandwidth',
    ftp: 5,
    supportClass: 'danger',
    supportClassSymbol: 'close',
    storageClass: 'danger',
    storageClassSymbol: 'close',
    domainClass: 'danger',
    domainClassSymbol: 'close',
    ribbon: false
  },
  {
    id: '2',
    title: 'Pro Business',
    subtitle: 'Professional plans',
    icon: 'ri-medal-fill',
    rate: 29,
    projects: 15,
    customers: 'Unlimited',
    bandwidth: 'Scalable Bandwidth',
    ftp: 12,
    supportClass: 'success',
    supportClassSymbol: 'checkbox',
    storageClass: 'danger',
    storageClassSymbol: 'close',
    domainClass: 'danger',
    domainClassSymbol: 'close',
    ribbon: true
  },
  {
    id: '3',
    title: 'Platinum Plan',
    subtitle: 'Enterprise Businesses',
    icon: 'ri-stack-fill',
    rate: 39,
    projects: 'Unlimited',
    customers: 'Unlimited',
    bandwidth: 'Scalable Bandwidth',
    ftp: 'Unlimited',
    supportClass: 'success',
    supportClassSymbol: 'checkbox',
    storageClass: 'success',
    storageClassSymbol: 'checkbox',
    domainClass: 'success',
    domainClassSymbol: 'checkbox',
    ribbon: false
  }
];

export const YearlyPlan: ServicePricingPlan[] = [
  {
    id: '1',
    title: 'Basic Plan',
    subtitle: 'For Startups',
    icon: 'ri-book-mark-line',
    rate: 171,
    projects: 3,
    customers: '299',
    bandwidth: 'Scalable Bandwidth',
    ftp: 5,
    supportClass: 'danger',
    supportClassSymbol: 'close',
    storageClass: 'danger',
    storageClassSymbol: 'close',
    domainClass: 'danger',
    domainClassSymbol: 'close',
    ribbon: false
  },
  {
    id: '2',
    title: 'Pro Business',
    subtitle: 'Professional plans',
    icon: 'ri-medal-fill',
    rate: 261,
    projects: 15,
    customers: 'Unlimited',
    bandwidth: 'Scalable Bandwidth',
    ftp: 12,
    supportClass: 'success',
    supportClassSymbol: 'checkbox',
    storageClass: 'danger',
    storageClassSymbol: 'close',
    domainClass: 'danger',
    domainClassSymbol: 'close',
    ribbon: true
  },
  {
    id: '3',
    title: 'Platinum Plan',
    subtitle: 'Enterprise Businesses',
    icon: 'ri-stack-fill',
    rate: 351,
    projects: 'Unlimited',
    customers: 'Unlimited',
    bandwidth: 'Scalable Bandwidth',
    ftp: 'Unlimited',
    supportClass: 'success',
    supportClassSymbol: 'checkbox',
    storageClass: 'success',
    storageClassSymbol: 'checkbox',
    domainClass: 'success',
    domainClassSymbol: 'checkbox',
    ribbon: false
  }
];
