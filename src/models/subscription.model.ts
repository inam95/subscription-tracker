import mongoose from 'mongoose';

interface Subscription {
  name: string;
  price: number;
  currency?: string;
  frequency?: string;
  category: string;
  paymentMethod: string;
  status?: string;
  startDate: Date;
  renewalDate: Date;
  user: mongoose.Schema.Types.ObjectId;
}

const subscriptionSchema = new mongoose.Schema<Subscription>(
  {
    name: {
      type: String,
      required: [true, 'Subscription: Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    price: {
      required: [true, 'Subscription: Price is required'],
      min: [0, 'Price must be greater than 0'],
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'LKR'],
      default: 'USD',
      uppercase: true,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
      type: String,
      required: [true, 'Subscription: Category is required'],
      enum: [
        'entertainment',
        'health',
        'fitness',
        'education',
        'food',
        'other',
      ],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Subscription: Payment method is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
    },
    startDate: {
      type: Date,
      required: [true, 'Subscription: Start date is required'],
      validate: {
        validator: (value) => {
          return value <= new Date();
        },
        message: 'Start date must be in the past',
      },
    },
    renewalDate: {
      type: Date,
      required: [true, 'Subscription: Renewal date is required'],
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: 'Renewal date must be after start date',
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Subscription: User is required'],
      index: true,
    },
  },
  { timestamps: true },
);

// Auto calculate renewal date if missing
subscriptionSchema.pre<Subscription>('save', function (next) {
  if (!this.renewalDate) {
    const renewalPeriods: Record<string, number> = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency || 'monthly'],
    );
  }

  // Auto-update the status if the renewal date is in the past
  if (this.renewalDate < new Date()) {
    this.status = 'expired';
  }

  next();
});

const Subscription = mongoose.model<Subscription>(
  'Subscription',
  subscriptionSchema,
);

export default Subscription;
