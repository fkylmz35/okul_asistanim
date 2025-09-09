import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Target, GraduationCap, Crown } from 'lucide-react';
import Card from './Card';
import Button from './Button';

interface PricingPlan {
  id: string;
  name: string;
  originalPrice?: number;
  price: number;
  discount?: string;
  badge?: string;
  isPopular?: boolean;
  features: Array<{
    text: string;
    included: boolean;
    highlighted?: boolean;
    icon?: 'star' | 'target' | 'graduation';
  }>;
  buttonText: string;
  buttonVariant?: 'primary' | 'outline' | 'disabled';
  buttonClass?: string;
  cardClass?: string;
  isCurrent?: boolean;
}

interface PricingTableProps {
  currentPlan?: string;
  onPlanSelect?: (planId: string) => void;
  showUsage?: boolean;
  remainingUsage?: {
    documents: number;
    maxDocuments: number;
    chats: number;
    maxChats: number;
  };
}

const PricingTable: React.FC<PricingTableProps> = ({ 
  currentPlan = 'free', 
  onPlanSelect,
  showUsage = false,
  remainingUsage
}) => {
  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Keşfet',
      price: 0,
      features: [
        { text: 'Günde 5 kez Sofia ile sohbet', included: true },
        { text: 'Sofia ile ayda 2 ödev yapımı ve doküman oluşturma', included: true },
        { text: 'Temel destek', included: true }
      ],
      buttonText: currentPlan === 'free' ? 'Mevcut Plan' : 'Ücretsiz Başla',
      buttonVariant: currentPlan === 'free' ? 'disabled' : 'outline',
      isCurrent: currentPlan === 'free'
    },
    {
      id: 'premium',
      name: 'Premium',
      originalPrice: 299,
      price: 199,
      discount: 'Lansmanına Özel %33 İndirim',
      features: [
        { text: 'Sofia ile sınırsız sohbet, soru çözümü ve konu anlatımı', included: true },
        { text: 'Sofia ile ayda 20 ödev yapımı ve doküman oluşturma', included: true },
        { text: 'Öncelikli destek', included: true }
      ],
      buttonText: currentPlan === 'premium' ? 'Mevcut Plan' : 'Planı Seç',
      buttonVariant: currentPlan === 'premium' ? 'disabled' : 'primary',
      buttonClass: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
      isCurrent: currentPlan === 'premium'
    },
    {
      id: 'pro',
      name: 'Pro+',
      originalPrice: 399,
      price: 299,
      discount: 'Lansmanına Özel %25 İndirim',
      badge: 'En Popüler',
      isPopular: true,
      features: [
        { text: 'Sofia ile sınırsız sohbet, soru çözümü ve konu anlatımı', included: true },
        { text: 'Sofia ile ayda 50 ödev yapımı ve doküman oluşturma', included: true },
        { 
          text: '20 LGS deneme oluşturma ve soru çözümü', 
          included: true, 
          highlighted: true,
          icon: 'target'
        },
        { 
          text: '20 YKS deneme oluşturma ve soru çözümü', 
          included: true, 
          highlighted: true,
          icon: 'graduation'
        },
        { text: 'Birebir destek', included: true }
      ],
      buttonText: currentPlan === 'pro' ? 'Mevcut Plan' : 'Planı Seç',
      buttonVariant: currentPlan === 'pro' ? 'disabled' : 'primary',
      buttonClass: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      cardClass: 'ring-2 ring-purple-500 ring-opacity-50',
      isCurrent: currentPlan === 'pro'
    }
  ];

  const getFeatureIcon = (iconType?: string) => {
    switch (iconType) {
      case 'star':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'target':
        return <Target className="w-4 h-4 text-purple-500" />;
      case 'graduation':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      default:
        return <Check className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          {/* Popular Badge */}
          {plan.isPopular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                <Crown className="w-4 h-4" />
                <span>{plan.badge}</span>
              </div>
            </div>
          )}

          <Card className={`p-6 h-full ${plan.cardClass || ''} ${plan.isPopular ? 'pt-8' : ''}`}>
            {/* Plan Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              
              {/* Price */}
              <div className="mb-2">
                {plan.price === 0 ? (
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    Ücretsiz
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ₺{plan.originalPrice}
                      </span>
                    )}
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      ₺{plan.price}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">/ay</span>
                  </div>
                )}
              </div>

              {/* Discount Badge */}
              {plan.discount && (
                <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                  {plan.discount}
                </div>
              )}
            </div>

            {/* Current Plan Usage */}
            {showUsage && plan.isCurrent && remainingUsage && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Bu Ay Kalan Kullanım</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Dökümanlar:</span>
                    <span className="font-medium">{remainingUsage.documents}/{remainingUsage.maxDocuments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Sohbetler:</span>
                    <span className="font-medium">{remainingUsage.chats}/{remainingUsage.maxChats}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start space-x-3">
                  {getFeatureIcon(feature.icon)}
                  <span className={`text-sm ${
                    feature.highlighted 
                      ? 'font-bold text-purple-700 dark:text-purple-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <Button
              onClick={() => onPlanSelect?.(plan.id)}
              disabled={plan.buttonVariant === 'disabled'}
              variant={plan.buttonVariant === 'disabled' ? 'outline' : 'primary'}
              className={`w-full ${plan.buttonClass || ''} ${
                plan.buttonVariant === 'disabled' 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              {plan.buttonText}
            </Button>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PricingTable;