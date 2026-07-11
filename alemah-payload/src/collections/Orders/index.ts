import type { CollectionConfig } from 'payload'

/**
 * Extensions to Payload Ecommerce's built-in Orders collection.
 *
 * The ecommerce plugin owns the payment, customer, items, amount, currency, and
 * transaction fields. Keep those default fields intact so its payment adapters
 * can create an order atomically after a verified payment.
 */
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    defaultColumns: ['orderNumber', 'status', 'amount', 'currency', 'createdAt'],
    useAsTitle: 'orderNumber',
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'fulfillmentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Returned', value: 'returned' },
      ],
      required: true,
    },
    {
      name: 'shiprocketShipmentId',
      type: 'text',
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          data.orderNumber = `AHM-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        }
        return data
      },
    ],
  },
}
