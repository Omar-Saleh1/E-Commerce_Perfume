/**
 * ============================================================================
 * ABSTRACT FACTORY DESIGN PATTERN — ORDER FULFILLMENT & LOGISTICS ECOSYSTEM
 * ============================================================================
 *
 * DOMAIN CONTEXT:
 * In a luxury Haute Parfumerie E-Commerce platform (ODORATUS), order fulfillment
 * is a multi-disciplinary process. Every fulfillment tier requires a cohesive
 * family of 4 interdependent subsystems:
 *
 * 1. IShippingCalculator: Computes distance/weight rates, thresholds, and customs duties.
 * 2. IPackagingService: Configures flacon insulation, thermal HazMat shielding, or velvet presentation boxes.
 * 3. ICarrierTracker: Generates provider-specific tracking codes, carrier metadata, and live milestones.
 * 4. IFulfillmentDocumentHandler: Formats manifests, air waybills (AWB), or wax-sealed master distiller certificates.
 *
 * The Abstract Factory Pattern ensures that the Client (OrderController / CheckoutService)
 * receives an entire, guaranteed-compatible family of fulfillment services without
 * knowing or coupling to any concrete logistics vendor.
 */

// ============================================================================
// 1. DATA CONTRACTS & VALUE OBJECTS
// ============================================================================

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode?: string;
  country?: string;
  notes?: string;
}

export interface OrderItemSnapshot {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface ShippingCalculationResult {
  baseRate: number;
  customsSurcharge: number;
  finalShippingFee: number;
  isComplimentary: boolean;
  currency: string;
  estimatedTransitDays: string;
}

export interface PackagingSpecification {
  tierName: string;
  boxType: string;
  insulationType: string;
  complimentarySamplesCount: number;
  hasCertificateOfAuthenticity: boolean;
  tamperEvidentSeal: string;
  specialInstructions: string;
}

export interface CarrierInfo {
  carrierCode: string;
  carrierName: string;
  serviceLevel: string;
  hubLocation: string;
  supportContact: string;
}

export interface TimelineMilestone {
  status: 'pending' | 'processing' | 'blending' | 'shipped' | 'delivered';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  completed: boolean;
}

export interface FulfillmentDocuments {
  documentType: string;
  documentNumber: string;
  generatedAt: Date;
  manifestDetails: string;
  downloadUrlOrBarcode: string;
}

export interface PreparedConsignment {
  fulfillmentTier: string;
  shipping: ShippingCalculationResult;
  packaging: PackagingSpecification;
  carrier: CarrierInfo;
  trackingNumber: string;
  estimatedDelivery: Date;
  timeline: TimelineMilestone[];
  documents: FulfillmentDocuments;
}

// ============================================================================
// 2. ABSTRACT PRODUCTS (4 INTERFACES)
// ============================================================================

/**
 * Abstract Product 1: Shipping Calculator
 */
export interface IShippingCalculator {
  calculateShipping(subtotal: number, address: ShippingAddress, totalWeightKg?: number): ShippingCalculationResult;
}

/**
 * Abstract Product 2: Packaging Service
 */
export interface IPackagingService {
  preparePackaging(items: OrderItemSnapshot[]): PackagingSpecification;
}

/**
 * Abstract Product 3: Carrier Tracker
 */
export interface ICarrierTracker {
  generateTrackingNumber(): string;
  getCarrierInfo(): CarrierInfo;
  calculateEstimatedDelivery(): Date;
  buildInitialTimeline(address: ShippingAddress): TimelineMilestone[];
}

/**
 * Abstract Product 4: Fulfillment Document Handler
 */
export interface IFulfillmentDocumentHandler {
  generateDocuments(trackingNumber: string, items: OrderItemSnapshot[], address: ShippingAddress): FulfillmentDocuments;
}

// ============================================================================
// 3. CONCRETE FAMILY 1: STANDARD MAISON GROUND FULFILLMENT
// ============================================================================

export class StandardShippingCalculator implements IShippingCalculator {
  calculateShipping(subtotal: number, address: ShippingAddress): ShippingCalculationResult {
    // Free ground delivery over $180
    const isComplimentary = subtotal >= 180;
    const baseRate = isComplimentary ? 0 : 15;
    return {
      baseRate,
      customsSurcharge: 0,
      finalShippingFee: baseRate,
      isComplimentary,
      currency: 'USD',
      estimatedTransitDays: '3 - 5 Business Days'
    };
  }
}

export class StandardPackagingService implements IPackagingService {
  preparePackaging(items: OrderItemSnapshot[]): PackagingSpecification {
    const totalFlacons = items.reduce((sum, item) => sum + item.quantity, 0);
    return {
      tierName: 'Standard Maison Presentation',
      boxType: 'Artisanal Rigid Sandboard Box',
      insulationType: 'Biodegradable Organic French Wool Cushioning',
      complimentarySamplesCount: 2, // 2 complimentary 2ml vials
      hasCertificateOfAuthenticity: true,
      tamperEvidentSeal: 'Maison Odoratus Gold Foil Label',
      specialInstructions: `Packed ${totalFlacons} flacon(s) with protective inner sleeve.`
    };
  }
}

export class StandardCarrierTracker implements ICarrierTracker {
  generateTrackingNumber(): string {
    return `ODR-STD-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  getCarrierInfo(): CarrierInfo {
    return {
      carrierCode: 'MAISON-POST',
      carrierName: 'Maison National Postal & Ground Network',
      serviceLevel: 'Standard Parcel Priority',
      hubLocation: 'Grasse Regional Logistics Hub, France',
      supportContact: 'concierge@odoratus.com'
    };
  }

  calculateEstimatedDelivery(): Date {
    return new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
  }

  buildInitialTimeline(address: ShippingAddress): TimelineMilestone[] {
    const now = new Date();
    return [
      {
        status: 'pending',
        title: 'Order Confirmed',
        description: 'Payment verified and flacons assigned to atelier preparation batch.',
        location: 'Grasse Atelier, France',
        timestamp: now,
        completed: true
      },
      {
        status: 'processing',
        title: 'Atelier Packaging',
        description: 'Flacons inspected, boxed with 2ml discovery vials, and sealed.',
        location: 'Grasse Atelier, France',
        timestamp: new Date(now.getTime() + 10 * 60 * 1000),
        completed: true
      }
    ];
  }
}

export class StandardDocumentHandler implements IFulfillmentDocumentHandler {
  generateDocuments(trackingNumber: string, items: OrderItemSnapshot[], address: ShippingAddress): FulfillmentDocuments {
    return {
      documentType: 'Domestic Ground Postal Label & Packing Slip',
      documentNumber: `LBL-${trackingNumber}`,
      generatedAt: new Date(),
      manifestDetails: `Standard parcel dispatch to ${address.city}, ${address.country || 'Domestic'}. Total items: ${items.length}`,
      downloadUrlOrBarcode: `https://logistics.odoratus.com/labels/${trackingNumber}.pdf`
    };
  }
}

// ============================================================================
// 4. CONCRETE FAMILY 2: EXPRESS GLOBAL AIR CONSIGNMENT (DHL EXPRESS)
// ============================================================================

export class ExpressGlobalShippingCalculator implements IShippingCalculator {
  calculateShipping(subtotal: number, address: ShippingAddress, totalWeightKg = 0.8): ShippingCalculationResult {
    const isComplimentary = subtotal >= 300;
    const baseRate = isComplimentary ? 0 : 35;
    const customsSurcharge = 10; // Cross-border HazMat perfume clearance fee
    const finalShippingFee = isComplimentary ? 0 : baseRate + customsSurcharge;

    return {
      baseRate,
      customsSurcharge: isComplimentary ? 0 : customsSurcharge,
      finalShippingFee,
      isComplimentary,
      currency: 'USD',
      estimatedTransitDays: '1 - 3 Business Days'
    };
  }
}

export class ExpressGlobalPackagingService implements IPackagingService {
  preparePackaging(items: OrderItemSnapshot[]): PackagingSpecification {
    return {
      tierName: 'Express Global Air Flacon Armor',
      boxType: 'Shock-Absorbing Thermal Air Case',
      insulationType: 'IATA-Certified Fragrance Temperature & Vapor Shielding',
      complimentarySamplesCount: 3,
      hasCertificateOfAuthenticity: true,
      tamperEvidentSeal: 'Reinforced Holographic Security Band',
      specialInstructions: 'HazMat Perfume Alcohol UN1266 Class 3 Compliant Packing.'
    };
  }
}

export class ExpressGlobalCarrierTracker implements ICarrierTracker {
  generateTrackingNumber(): string {
    return `DHL-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  getCarrierInfo(): CarrierInfo {
    return {
      carrierCode: 'DHL-EXPRESS',
      carrierName: 'DHL Express Worldwide Aviation',
      serviceLevel: 'International Express Air Priority',
      hubLocation: 'Nice Côte d’Azur Aviation Hub, France',
      supportContact: 'dhl-vip@odoratus.com'
    };
  }

  calculateEstimatedDelivery(): Date {
    return new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  }

  buildInitialTimeline(address: ShippingAddress): TimelineMilestone[] {
    const now = new Date();
    return [
      {
        status: 'pending',
        title: 'Consignment Created',
        description: 'International air waybill registered with DHL Global Aviation network.',
        location: 'Nice Côte d’Azur Air Terminal, France',
        timestamp: now,
        completed: true
      },
      {
        status: 'processing',
        title: 'HazMat & Customs Clearance Manifest',
        description: `Export clearance logged for delivery to ${address.city}, ${address.country || 'International'}.`,
        location: 'Nice Côte d’Azur Aviation Hub, France',
        timestamp: new Date(now.getTime() + 15 * 60 * 1000),
        completed: true
      }
    ];
  }
}

export class ExpressGlobalDocumentHandler implements IFulfillmentDocumentHandler {
  generateDocuments(trackingNumber: string, items: OrderItemSnapshot[], address: ShippingAddress): FulfillmentDocuments {
    return {
      documentType: 'International Air Waybill (AWB) & Commercial Customs Invoice',
      documentNumber: `AWB-${trackingNumber}`,
      generatedAt: new Date(),
      manifestDetails: `Cross-border Air Waybill. Consignee: ${address.street}, ${address.city}, ${address.country}. IATA UN1266 certified.`,
      downloadUrlOrBarcode: `https://dhl.com/track/awb/${trackingNumber}`
    };
  }
}

// ============================================================================
// 5. CONCRETE FAMILY 3: VIP ATELIER WHITE-GLOVE CONCIERGE
// ============================================================================

export class WhiteGloveVIPShippingCalculator implements IShippingCalculator {
  calculateShipping(subtotal: number, address: ShippingAddress): ShippingCalculationResult {
    // Dedicated Chauffeur Service: Complimentary for orders over $500, else $75
    const isComplimentary = subtotal >= 500;
    const baseRate = isComplimentary ? 0 : 75;

    return {
      baseRate,
      customsSurcharge: 0,
      finalShippingFee: baseRate,
      isComplimentary,
      currency: 'USD',
      estimatedTransitDays: 'Same-Day or Dedicated Time-Slot Handover'
    };
  }
}

export class WhiteGloveVIPPackagingService implements IPackagingService {
  preparePackaging(items: OrderItemSnapshot[]): PackagingSpecification {
    return {
      tierName: 'Haute Parfumerie VIP Presentation Coffer',
      boxType: 'Handcrafted Ebony Velvet Coffer with Brass Latches',
      insulationType: 'Silk Satin Bedding with Custom Flacon Cavity',
      complimentarySamplesCount: 5, // 5 complimentary bespoke vials
      hasCertificateOfAuthenticity: true,
      tamperEvidentSeal: 'Hand-Poured Burgundy Wax Seal with Maison Signet',
      specialInstructions: 'Includes Hand-Written Calligraphy Note from the Master Distiller.'
    };
  }
}

export class WhiteGloveVIPCarrierTracker implements ICarrierTracker {
  generateTrackingNumber(): string {
    return `VIP-CONCIERGE-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  getCarrierInfo(): CarrierInfo {
    return {
      carrierCode: 'MAISON-CONCIERGE',
      carrierName: 'Maison Odoratus Private Chauffeur Concierge',
      serviceLevel: 'Dedicated White-Glove Hand Delivery',
      hubLocation: 'Maison Flagship Atelier Salon',
      supportContact: 'vip-ambassador@odoratus.com'
    };
  }

  calculateEstimatedDelivery(): Date {
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  }

  buildInitialTimeline(address: ShippingAddress): TimelineMilestone[] {
    const now = new Date();
    return [
      {
        status: 'pending',
        title: 'VIP Commission Received',
        description: 'Dedicated Private Ambassador assigned to hand-inspect and prepare flacons.',
        location: 'Maison Private Salon',
        timestamp: now,
        completed: true
      },
      {
        status: 'processing',
        title: 'Velvet Coffer Wax Sealing',
        description: 'Coffer sealed with burgundy wax signet and handed to private chauffeur.',
        location: 'Maison Private Salon',
        timestamp: new Date(now.getTime() + 20 * 60 * 1000),
        completed: true
      }
    ];
  }
}

export class WhiteGloveVIPDocumentHandler implements IFulfillmentDocumentHandler {
  generateDocuments(trackingNumber: string, items: OrderItemSnapshot[], address: ShippingAddress): FulfillmentDocuments {
    return {
      documentType: 'Master Distiller Parchment Certificate & Diplomatic Consignment Pass',
      documentNumber: `VIP-CERT-${trackingNumber.slice(-6)}`,
      generatedAt: new Date(),
      manifestDetails: `White-Glove direct handover to ${address.street}, ${address.city}. Chauffeur direct line available.`,
      downloadUrlOrBarcode: `https://vip.odoratus.com/concierge/pass/${trackingNumber}`
    };
  }
}

// ============================================================================
// 6. ABSTRACT FACTORY INTERFACE
// ============================================================================

/**
 * The Abstract Factory interface declares creation methods for each
 * abstract product in the fulfillment family.
 */
export interface IFulfillmentProviderFactory {
  getTierName(): string;
  createShippingCalculator(): IShippingCalculator;
  createPackagingService(): IPackagingService;
  createCarrierTracker(): ICarrierTracker;
  createDocumentHandler(): IFulfillmentDocumentHandler;
}

// ============================================================================
// 7. CONCRETE FACTORIES
// ============================================================================

export class StandardMaisonFulfillmentFactory implements IFulfillmentProviderFactory {
  getTierName(): string {
    return 'Standard Maison Ground';
  }
  createShippingCalculator(): IShippingCalculator {
    return new StandardShippingCalculator();
  }
  createPackagingService(): IPackagingService {
    return new StandardPackagingService();
  }
  createCarrierTracker(): ICarrierTracker {
    return new StandardCarrierTracker();
  }
  createDocumentHandler(): IFulfillmentDocumentHandler {
    return new StandardDocumentHandler();
  }
}

export class ExpressGlobalAirFulfillmentFactory implements IFulfillmentProviderFactory {
  getTierName(): string {
    return 'Express Global Air (DHL)';
  }
  createShippingCalculator(): IShippingCalculator {
    return new ExpressGlobalShippingCalculator();
  }
  createPackagingService(): IPackagingService {
    return new ExpressGlobalPackagingService();
  }
  createCarrierTracker(): ICarrierTracker {
    return new ExpressGlobalCarrierTracker();
  }
  createDocumentHandler(): IFulfillmentDocumentHandler {
    return new ExpressGlobalDocumentHandler();
  }
}

export class WhiteGloveVIPFulfillmentFactory implements IFulfillmentProviderFactory {
  getTierName(): string {
    return 'VIP White-Glove Concierge';
  }
  createShippingCalculator(): IShippingCalculator {
    return new WhiteGloveVIPShippingCalculator();
  }
  createPackagingService(): IPackagingService {
    return new WhiteGloveVIPPackagingService();
  }
  createCarrierTracker(): ICarrierTracker {
    return new WhiteGloveVIPCarrierTracker();
  }
  createDocumentHandler(): IFulfillmentDocumentHandler {
    return new WhiteGloveVIPDocumentHandler();
  }
}

// ============================================================================
// 8. FACTORY REGISTRY & PROVIDER RESOLVER
// ============================================================================

/**
 * Registry mapping shipping tier identifiers to their respective Concrete Factories.
 * Allows dynamic extension at runtime (Open/Closed Principle).
 */
export class FulfillmentProviderRegistry {
  private static factories: Map<string, IFulfillmentProviderFactory> = new Map([
    ['standard', new StandardMaisonFulfillmentFactory()],
    ['ground', new StandardMaisonFulfillmentFactory()],
    ['express', new ExpressGlobalAirFulfillmentFactory()],
    ['dhl', new ExpressGlobalAirFulfillmentFactory()],
    ['international', new ExpressGlobalAirFulfillmentFactory()],
    ['vip', new WhiteGloveVIPFulfillmentFactory()],
    ['white-glove', new WhiteGloveVIPFulfillmentFactory()],
    ['concierge', new WhiteGloveVIPFulfillmentFactory()]
  ]);

  /**
   * Register a new fulfillment provider dynamically without altering client code.
   */
  public static registerFactory(key: string, factory: IFulfillmentProviderFactory): void {
    this.factories.set(key.toLowerCase().trim(), factory);
  }

  /**
   * Resolve appropriate factory based on explicit tier name, cart value, or destination.
   */
  public static resolveFactory(tier?: string, subtotal = 0, address?: ShippingAddress): IFulfillmentProviderFactory {
    if (tier && this.factories.has(tier.toLowerCase().trim())) {
      return this.factories.get(tier.toLowerCase().trim())!;
    }

    // Auto-selection heuristic for luxury commerce:
    // 1. Orders >= $500 automatically qualify for White-Glove VIP
    if (subtotal >= 500) {
      return new WhiteGloveVIPFulfillmentFactory();
    }

    // 2. Non-domestic/international addresses automatically route to Express Global Air
    if (address?.country && address.country.toLowerCase() !== 'france' && address.country.toLowerCase() !== 'domestic') {
      return new ExpressGlobalAirFulfillmentFactory();
    }

    // 3. Default standard
    return new StandardMaisonFulfillmentFactory();
  }
}

// ============================================================================
// 9. CLIENT / ORCHESTRATION SERVICE
// ============================================================================

/**
 * The Client depends ONLY on the IFulfillmentProviderFactory interface
 * and the 4 Abstract Product interfaces.
 */
export class OrderFulfillmentService {
  /**
   * Orchestrates complete fulfillment preparation for an order:
   * 1. Factory creates Calculator -> calculates exact rate & transit estimate
   * 2. Factory creates Packaging -> configures flacon insulation & gift coffer
   * 3. Factory creates Tracker -> generates tracking code & initial timeline
   * 4. Factory creates DocumentHandler -> generates dispatch manifests & labels
   */
  public prepareOrderConsignment(
    factory: IFulfillmentProviderFactory,
    subtotal: number,
    items: OrderItemSnapshot[],
    address: ShippingAddress
  ): PreparedConsignment {
    // Instantiate all 4 related products using the Abstract Factory
    const calculator: IShippingCalculator = factory.createShippingCalculator();
    const packagingService: IPackagingService = factory.createPackagingService();
    const tracker: ICarrierTracker = factory.createCarrierTracker();
    const docHandler: IFulfillmentDocumentHandler = factory.createDocumentHandler();

    // Execute business operations polymorphically
    const shipping = calculator.calculateShipping(subtotal, address);
    const packaging = packagingService.preparePackaging(items);
    const carrier = tracker.getCarrierInfo();
    const trackingNumber = tracker.generateTrackingNumber();
    const estimatedDelivery = tracker.calculateEstimatedDelivery();
    const timeline = tracker.buildInitialTimeline(address);
    const documents = docHandler.generateDocuments(trackingNumber, items, address);

    return {
      fulfillmentTier: factory.getTierName(),
      shipping,
      packaging,
      carrier,
      trackingNumber,
      estimatedDelivery,
      timeline,
      documents
    };
  }
}

// Export singleton client service
export const fulfillmentService = new OrderFulfillmentService();
