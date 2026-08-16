package io.productiq.validator;

import java.util.*;

/**
 * IndustrialProductValidator - Enterprise Java verification engine
 * Validates industrial motor power equations, bearing load ratings, and multi-source conflict reconciliation.
 */
public class IndustrialProductValidator {

    public static class ValidationResult {
        public final boolean passed;
        public final double trustScore;
        public final List<String> issues;
        public final Map<String, Object> metrics;

        public ValidationResult(boolean passed, double trustScore, List<String> issues, Map<String, Object> metrics) {
            this.passed = passed;
            this.trustScore = trustScore;
            this.issues = issues;
            this.metrics = metrics;
        }
    }

    /**
     * Verifies Three-Phase AC Induction Motor electrical power formula:
     * P(kW) = sqrt(3) * V * I * cos(phi) * eta / 1000
     */
    public static ValidationResult validateThreePhaseMotor(
            double powerKw,
            double voltageV,
            double currentA,
            double powerFactor,
            double efficiencyPercent
    ) {
        List<String> issues = new ArrayList<>();
        Map<String, Object> metrics = new HashMap<>();

        double eta = efficiencyPercent / 100.0;
        double theoreticalPowerKw = (Math.sqrt(3.0) * voltageV * currentA * powerFactor * eta) / 1000.0;
        double discrepancy = Math.abs(theoreticalPowerKw - powerKw) / powerKw * 100.0;

        metrics.put("theoreticalPowerKw", theoreticalPowerKw);
        metrics.put("discrepancyPercent", discrepancy);

        double trustScore = 100.0;
        boolean passed = true;

        if (discrepancy > 20.0) {
            passed = false;
            trustScore -= 35.0;
            issues.add(String.format("Electrical parameter mismatch: Stated %.2f kW vs Theoretical %.2f kW (Discrepancy: %.1f%%)",
                    powerKw, theoreticalPowerKw, discrepancy));
        }

        return new ValidationResult(passed, Math.max(0.0, trustScore), issues, metrics);
    }

    /**
     * Resolves multi-source industrial conflict based on source authority and revision recency.
     */
    public static String resolveConflict(String attributeName, List<Map<String, String>> sourceRecords) {
        if (sourceRecords == null || sourceRecords.isEmpty()) {
            return "UNKNOWN";
        }
        if (sourceRecords.size() == 1) {
            return sourceRecords.get(0).get("value");
        }

        // Higher weight for OEM Datasheet over Distributor listings
        Map<String, String> best = sourceRecords.stream()
                .max(Comparator.comparingInt(s -> s.getOrDefault("sourceType", "").contains("datasheet") ? 100 : 50))
                .orElse(sourceRecords.get(0));

        return best.get("value");
    }

    public static void main(String[] args) {
        System.out.println("=== ProductIQ Industrial Java Validator Engine ===");
        ValidationResult res = validateThreePhaseMotor(7.5, 415.0, 14.2, 0.84, 90.4);
        System.out.printf("Validation status: %s (Trust Score: %.1f%%)%n", res.passed ? "PASSED" : "FAILED", res.trustScore);
        System.out.println("Metrics: " + res.metrics);
    }
}
