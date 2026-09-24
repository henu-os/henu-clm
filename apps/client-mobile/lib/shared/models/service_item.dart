class ServiceAddOn {
  final String id;
  final String title;
  final String description;
  final double price;
  final String billingType;

  const ServiceAddOn({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.billingType,
  });

  factory ServiceAddOn.fromJson(Map<String, dynamic> json) {
    return ServiceAddOn(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      billingType: json['billing_type'] as String? ?? 'ONE_TIME',
    );
  }
}

class ServiceItem {
  final String id;
  final String name;
  final String code;
  final String category;
  final String shortDescription;
  final String fullDescription;
  final double startingPrice;
  final String currency;
  final String deliveryDays;
  final List<String> features;
  final List<ServiceAddOn> addOns;

  const ServiceItem({
    required this.id,
    required this.name,
    required this.code,
    required this.category,
    required this.shortDescription,
    required this.fullDescription,
    required this.startingPrice,
    required this.currency,
    required this.deliveryDays,
    required this.features,
    required this.addOns,
  });

  factory ServiceItem.fromJson(Map<String, dynamic> json) {
    return ServiceItem(
      id: json['id'] as String,
      name: json['name'] as String,
      code: json['code'] as String,
      category: json['category'] as String,
      shortDescription: json['short_description'] as String? ?? '',
      fullDescription: json['full_description'] as String? ?? '',
      startingPrice: (json['starting_price'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? 'USD',
      deliveryDays: json['delivery_days'] as String? ?? '14-21 Days',
      features: (json['features'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      addOns: (json['add_ons'] as List<dynamic>?)
              ?.map((e) => ServiceAddOn.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}
