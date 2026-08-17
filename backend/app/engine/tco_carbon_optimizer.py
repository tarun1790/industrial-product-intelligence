import math
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class YearlyTCOBreakdown(BaseModel):
    year: int
    baseline_energy_cost_usd: float
    optimized_energy_cost_usd: float
    cumulative_savings_usd: float
    cumulative_carbon_saved_tons_co2: float

class TCOComparisonResult(BaseModel):
    part_number: str
    rated_power_kw: float
    annual_operating_hours: int
    electricity_tariff_usd_kwh: float
    baseline_efficiency_pct: float
    optimized_efficiency_pct: float
    initial_capex_premium_usd: float
    simple_payback_period_months: float
    ten_year_net_present_value_usd: float
    ten_year_total_energy_saved_kwh: float
    ten_year_total_carbon_abated_tons: float
    discount_rate_pct: float
    yearly_trajectory: List[YearlyTCOBreakdown]
    financial_recommendation: str

class TCOCarbonOptimizerEngine:
    @classmethod
    def calculate_tco_and_carbon_roi(
        cls,
        part_number: str = "M3BP 160MLA 4",
        power_kw: float = 7.5,
        annual_hours: int = 6000, # Continuous 2-shift / 24-7
        tariff_usd_kwh: float = 0.14,
        baseline_eff: float = 87.7, # Standard IE2 Legacy
        optimized_eff: float = 90.4, # ABB Process Performance IE3
        capex_diff: float = 480.0 # Purchase price difference
    ) -> TCOComparisonResult:
        # Annual energy consumption kWh
        kwh_baseline = (power_kw / (baseline_eff / 100.0)) * annual_hours
        kwh_optimized = (power_kw / (optimized_eff / 100.0)) * annual_hours
        annual_kwh_saved = kwh_baseline - kwh_optimized
        annual_dollars_saved = annual_kwh_saved * tariff_usd_kwh

        # Payback period
        payback_months = round((capex_diff / max(1.0, annual_dollars_saved)) * 12.0, 1)

        # 10-Year NPV with 6% discount rate
        discount_rate = 0.06
        grid_carbon_factor = 0.42 # kg CO2 / kWh average grid intensity
        annual_carbon_tons = (annual_kwh_saved * grid_carbon_factor) / 1000.0

        npv = -capex_diff
        cumulative_savings = 0.0
        cumulative_carbon = 0.0
        trajectory: List[YearlyTCOBreakdown] = []

        base_annual_cost = kwh_baseline * tariff_usd_kwh
        opt_annual_cost = kwh_optimized * tariff_usd_kwh

        for yr in range(1, 11):
            discount_factor = (1.0 + discount_rate) ** yr
            npv += (annual_dollars_saved / discount_factor)
            cumulative_savings += annual_dollars_saved
            cumulative_carbon += annual_carbon_tons
            trajectory.append(YearlyTCOBreakdown(
                year=yr,
                baseline_energy_cost_usd=round(base_annual_cost * yr, 2),
                optimized_energy_cost_usd=round(opt_annual_cost * yr + capex_diff, 2),
                cumulative_savings_usd=round(cumulative_savings - capex_diff, 2),
                cumulative_carbon_saved_tons_co2=round(cumulative_carbon, 2)
            ))

        return TCOComparisonResult(
            part_number=part_number,
            rated_power_kw=power_kw,
            annual_operating_hours=annual_hours,
            electricity_tariff_usd_kwh=tariff_usd_kwh,
            baseline_efficiency_pct=baseline_eff,
            optimized_efficiency_pct=optimized_eff,
            initial_capex_premium_usd=capex_diff,
            simple_payback_period_months=payback_months,
            ten_year_net_present_value_usd=round(npv, 2),
            ten_year_total_energy_saved_kwh=round(annual_kwh_saved * 10.0, 1),
            ten_year_total_carbon_abated_tons=round(annual_carbon_tons * 10.0, 2),
            discount_rate_pct=discount_rate * 100.0,
            yearly_trajectory=trajectory,
            financial_recommendation=f"HIGHLY RECOMMENDED: Payback achieved in {payback_months} months with 10-Year NPV of ${round(npv, 2):,.2f} USD and {round(annual_carbon_tons * 10.0, 1)} tons Scope 2 CO2 reduction."
        )
