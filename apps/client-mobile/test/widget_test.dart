import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:client_mobile/main.dart';
import 'package:client_mobile/shared/widgets/henu_badge.dart';
import 'package:client_mobile/shared/widgets/henu_button.dart';
import 'package:client_mobile/shared/widgets/henu_card.dart';

void main() {
  group('Widget Tests', () {
    testWidgets('HenuBadge renders status label and dot', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Center(
              child: HenuBadge.status('APPROVED'),
            ),
          ),
        ),
      );

      expect(find.text('APPROVED'), findsOneWidget);
    });

    testWidgets('HenuButton renders label and triggers tap', (WidgetTester tester) async {
      bool tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Center(
              child: HenuButton(
                text: 'Sign In',
                onPressed: () {
                  tapped = true;
                },
              ),
            ),
          ),
        ),
      );

      expect(find.text('Sign In'), findsOneWidget);
      await tester.tap(find.text('Sign In'));
      expect(tapped, isTrue);
    });

    testWidgets('HenuCard renders child widget with padding', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: HenuCard(
                child: Text('Card Content Test'),
              ),
            ),
          ),
        ),
      );

      expect(find.text('Card Content Test'), findsOneWidget);
    });

    testWidgets('HenuClmMobileApp bootstraps into MaterialApp', (WidgetTester tester) async {
      await tester.pumpWidget(const HenuClmMobileApp());
      expect(find.byType(MaterialApp), findsOneWidget);
      expect(find.text('HENU OS'), findsWidgets);
    });
  });
}
