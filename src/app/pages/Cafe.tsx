import { useState, useMemo } from "react";
import * as React from "react";
import { Coffee, DollarSign, TrendingUp, PieChart, Download } from "lucide-react";
import { KPICard } from "../components/KPICard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ErrorModal, ErrorType } from "../components/ErrorModal";
import { SuccessModal, SuccessType } from "../components/SuccessModal";
import { ModelDetailsModal } from "../components/ModelDetailsModal";
import cafeMascot from "../../imports/no_bg_Cafe-2.png";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Slider } from "../components/ui/slider";
import { toast } from "sonner";

const menuItems = [
  { name: "Cappuccino", physicalSales: 1240, onlineSales: 320, equilibrium: "balanced", trend: [20, 25, 30, 28, 35, 40, 42], margin: 68 },
  { name: "Iced Latte", physicalSales: 980, onlineSales: 420, equilibrium: "balanced", trend: [15, 18, 22, 25, 28, 32, 35], margin: 72 },
  { name: "Pet-Safe Pupcake", physicalSales: 560, onlineSales: 890, equilibrium: "diverging", trend: [30, 32, 28, 25, 22, 20, 18], margin: 55 },
  { name: "Cheese Danish", physicalSales: 780, onlineSales: 180, equilibrium: "diverging", trend: [25, 30, 35, 38, 42, 45, 48], margin: 64 },
  { name: "Green Smoothie", physicalSales: 340, onlineSales: 310, equilibrium: "balanced", trend: [10, 12, 15, 18, 20, 22, 25], margin: 70 },
];

const sentimentData = [
  { name: "Positive", value: 78, color: "#3AE4FA" },
  { name: "Neutral", value: 15, color: "#cccccc" },
  { name: "Negative", value: 7, color: "#F53799" },
];

const flaggedReviews = [
  { platform: "Shopee", text: "Coffee was cold and service was slow. Very disappointed.", date: "Apr 14, 2026", product: "Cappuccino", keywords: ["cold", "slow"] },
  { platform: "Tiktok", text: "The pupcake tasted stale and my dog didn't like it.", date: "Apr 13, 2026", product: "Pet-Safe Pupcake", keywords: ["stale"] },
  { platform: "Shopee", text: "Overpriced for such small portions. Won't order again.", date: "Apr 12, 2026", product: "Cheese Danish", keywords: ["overpriced"] },
];

export function Cafe() {
  const [metricType, setMetricType] = useState("revenue");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [menuFilter, setMenuFilter] = useState("all");
  const [discountValue, setDiscountValue] = useState([15]);
  const [keywords, setKeywords] = useState(["cold", "slow", "stale", "overpriced", "disappointed"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; type: ErrorType | null }>({
    isOpen: false,
    type: null,
  });
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; type: SuccessType | null }>({
    isOpen: false,
    type: null,
  });
  const [showModelDetails, setShowModelDetails] = useState(false);
  const [lastModelUpdate, setLastModelUpdate] = useState("2 hours ago");

  // Dynamic forecast data based on metric type
  const forecastData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const multiplier = metricType === "revenue" ? 1000 : 1;
      return {
        date: `Day ${i + 1}`,
        actual: i < 20 ? Math.random() * 5 * multiplier + 15 * multiplier : null,
        forecast: i >= 15 ? Math.random() * 5 * multiplier + 16 * multiplier : null,
        confidenceLow: i >= 15 ? Math.random() * 3 * multiplier + 14 * multiplier : null,
        confidenceHigh: i >= 15 ? Math.random() * 7 * multiplier + 18 * multiplier : null,
      };
    });
  }, [metricType]);

  // Filtered menu items based on filter
  const filteredMenuItems = useMemo(() => {
    if (menuFilter === "all") return menuItems;
    if (menuFilter === "top") return menuItems.filter(item => item.physicalSales > 700);
    if (menuFilter === "under") return menuItems.filter(item => item.physicalSales < 500);
    if (menuFilter === "diverging") return menuItems.filter(item => item.equilibrium === "diverging");
    return menuItems;
  }, [menuFilter]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleExportReport = () => {
    toast.info("Generating report...");
    setTimeout(() => {
      // Simulate export failure
      setErrorModal({ isOpen: true, type: "export_failed" });
    }, 1500);
  };

  const handleRetrainModel = () => {
    toast.info("Retraining model...");
    setTimeout(() => {
      // Simulate model training failure
      setErrorModal({ isOpen: true, type: "model_failed" });
    }, 2000);
  };

  const handleRetryExport = () => {
    setErrorModal({ isOpen: false, type: null });
    toast.info("Retrying export with optimized parameters...");
    setTimeout(() => {
      setSuccessModal({ isOpen: true, type: "export_success" });
    }, 1500);
  };

  const handleRetryModelTraining = () => {
    setErrorModal({ isOpen: false, type: null });
    toast.info("Retrying model training...");
    setTimeout(() => {
      setSuccessModal({ isOpen: true, type: "model_retrain_success" });
    }, 2000);
  };

  const handleViewModelDetails = () => {
    setShowModelDetails(true);
  };

  const handleContactSupport = () => {
    toast.success("Support ticket created. Our team will contact you within 24 hours.");
    window.open("mailto:support@woofai.com?subject=Data Corruption Issue&body=I need assistance with a data integrity issue in my Cafe dashboard.", "_blank");
  };

  const handleRefreshData = () => {
    toast.info("Refreshing data...");
    setTimeout(() => {
      toast.success("Data refreshed successfully");
      // Simulate data refresh by forcing a re-render
      setMenuFilter("all");
    }, 1000);
  };

  const handleRetryDataSync = () => {
    setErrorModal({ isOpen: false, type: null });
    toast.info("Retrying data synchronization...");
    setTimeout(() => {
      // Update last model update time to show data was refreshed
      setLastModelUpdate("just now");
      setSuccessModal({ isOpen: true, type: "data_sync_success" });
    }, 2000);
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
      toast.success("Keyword added");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
    toast.info("Keyword removed");
  };

  const getEquilibriumColor = (status: string) => {
    if (status === "balanced") return "bg-green-500";
    if (status === "diverging") return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 md:space-y-8 lg:space-y-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl lg:text-[36px] font-extrabold text-[#223047]">
            Cafe Intelligence Hub
          </h1>
          <p className="text-sm md:text-base text-[#223047] opacity-60 mt-1 md:mt-2" style={{ lineHeight: "1.6" }}>
            Food & Beverage performance analytics and AI-powered demand forecasting
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Badge className="bg-[#F53799] text-white hover:bg-[#F53799] px-3 md:px-4 py-1 text-xs md:text-sm">
            Cafe Sector
          </Badge>
          <Button
            onClick={handleExportReport}
            variant="outline"
            className="border-[#FFD9EC] gap-2 text-xs md:text-sm"
            size="sm"
          >
            <Download className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="bg-white border border-[#FFD9EC] rounded-2xl md:rounded-3xl p-4 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Cafe Revenue Today */}
          <div className="flex items-center gap-2 md:gap-3 bg-[#FFF2FA] border border-[#FFD9EC] rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#F53799] to-[#D42A7D] flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[#223047] opacity-60 truncate">Cafe Revenue Today</div>
              <div className="text-base md:text-xl font-bold text-[#223047]">₱18,450</div>
              <div className="text-xs text-green-600 font-medium hidden md:block">+12.3% ↑</div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="flex items-center gap-2 md:gap-3 bg-[#FFF2FA] border border-[#FFD9EC] rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#3AE4FA] to-[#5CE1E6] flex items-center justify-center flex-shrink-0">
              <Coffee className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[#223047] opacity-60 truncate">Total Orders</div>
              <div className="text-base md:text-xl font-bold text-[#223047]">87</div>
              <div className="text-xs text-green-600 font-medium hidden md:block">+8.2% ↑</div>
            </div>
          </div>

          {/* Avg Check Size */}
          <div className="flex items-center gap-2 md:gap-3 bg-[#FFF2FA] border border-[#FFD9EC] rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#3AE4FA] to-[#5CE1E6] flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[#223047] opacity-60 truncate">Avg Check Size</div>
              <div className="text-base md:text-xl font-bold text-[#223047]">₱285</div>
              <div className="text-xs text-green-600 font-medium hidden md:block">+3.5% ↑</div>
            </div>
          </div>

          {/* Active Menu Items */}
          <div className="flex items-center gap-2 md:gap-3 bg-[#FFF2FA] border border-[#FFD9EC] rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#3AE4FA] to-[#5CE1E6] flex items-center justify-center flex-shrink-0">
              <PieChart className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[#223047] opacity-60 truncate">Active Menu Items</div>
              <div className="text-base md:text-xl font-bold text-[#223047]">24</div>
              <Badge className="bg-[#3AE4FA] text-white hover:bg-[#3AE4FA] text-xs mt-1 hidden md:inline-flex">
                All Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* DEMAND FORECAST PANEL - Best Model Only */}
      <div className="bg-white border border-[#FFD9EC] rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div className="flex-1">
            <h2 className="text-lg md:text-xl lg:text-[22px] font-bold text-[#223047]">
              Cafe Demand Forecast
            </h2>
            <p className="text-xs md:text-sm text-[#223047] opacity-60 mt-1" style={{ lineHeight: "1.6" }}>
              AI-selected best model: <span className="font-semibold text-[#F53799]">Prophet</span> <span className="hidden sm:inline">(MASE: 0.68, Accuracy: 92%)</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Revenue", "Order Volume"].map((metric) => (
              <Button
                key={metric}
                size="sm"
                variant={metricType === metric.toLowerCase().replace(" ", "") ? "default" : "outline"}
                onClick={() => setMetricType(metric.toLowerCase().replace(" ", ""))}
                className={
                  metricType === metric.toLowerCase().replace(" ", "")
                    ? "bg-[#F53799] hover:bg-[#D42A7D] text-xs md:text-sm"
                    : "border-[#FFD9EC] hover:bg-[#FFF2FA] text-xs md:text-sm"
                }
              >
                {metric}
              </Button>
            ))}
          </div>
        </div>

        {/* Forecast Chart */}
        <ResponsiveContainer width="100%" height={250} className="md:!h-[350px] lg:!h-[400px]">
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient key="confidenceBand-gradient" id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD9EC" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#FFD9EC" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFD9EC" vertical={false} />
            <XAxis dataKey="date" stroke="#223047" style={{ fontSize: "12px" }} />
            <YAxis stroke="#223047" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #FFD9EC",
                borderRadius: "12px",
                padding: "12px",
              }}
            />
            <Area
              key="area-confidence-high-cafe"
              type="monotone"
              dataKey="confidenceHigh"
              stroke="none"
              fill="url(#confidenceBand)"
              animationDuration={800}
            />
            <Area
              key="area-confidence-low-cafe"
              type="monotone"
              dataKey="confidenceLow"
              stroke="none"
              fill="white"
              animationDuration={800}
            />
            <Line
              key="line-actual-cafe"
              type="monotone"
              dataKey="actual"
              stroke="#223047"
              strokeWidth={2.5}
              dot={false}
              animationDuration={800}
            />
            <Line
              key="line-forecast-cafe"
              type="monotone"
              dataKey="forecast"
              stroke="#F53799"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={false}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Model Info & Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-6 border-t border-[#FFD9EC]">
          <div className="bg-[#FFF7FB] border border-[#FFD9EC] rounded-xl md:rounded-2xl p-4 md:p-6 space-y-3">
            <h3 className="text-sm md:text-base font-bold text-[#223047]">Active Model Performance</h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <div className="text-xs text-[#223047] opacity-60 mb-1">MASE</div>
                <div className="text-xl md:text-2xl font-bold text-[#F53799]">0.68</div>
                <div className="text-xs text-green-600 hidden md:block">Beats baseline by 32%</div>
              </div>
              <div>
                <div className="text-xs text-[#223047] opacity-60 mb-1">RMSE</div>
                <div className="text-xl md:text-2xl font-bold text-[#223047]">1053</div>
              </div>
              <div>
                <div className="text-xs text-[#223047] opacity-60 mb-1">MAPE</div>
                <div className="text-xl md:text-2xl font-bold text-[#223047]">4.2%</div>
              </div>
              <div>
                <div className="text-xs text-[#223047] opacity-60 mb-1">R²</div>
                <div className="text-xl md:text-2xl font-bold text-[#223047]">0.92</div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFF7FB] border border-[#FFD9EC] rounded-xl md:rounded-2xl p-4 md:p-6 space-y-3 md:space-y-4">
            <h3 className="text-sm md:text-base font-bold text-[#223047]">WOOF Analysis</h3>
            <p className="text-xs md:text-sm text-[#223047] opacity-70" style={{ lineHeight: "1.6" }}>
              Prophet model selected for superior seasonal pattern detection. <span className="hidden md:inline">Slight under-forecast bias of -0.15% detected. Strong performance on weekend peaks.</span> Model last retrained {lastModelUpdate}.
            </p>
            <Button onClick={handleRetrainModel} className="w-full bg-[#F53799] hover:bg-[#D42A7D] text-xs md:text-sm" size="sm">
              Retrain Model
            </Button>
          </div>
        </div>
      </div>

      {/* VISUAL RELIEF DIVIDER - AI INSIGHT WITH MASCOT */}
      <div
        className="rounded-2xl flex items-center justify-between px-4 md:px-8 py-4 relative overflow-hidden"
        style={{ background: "linear-gradient(to right, #FFF7FB, #FFF2FA)" }}
      >
        <div className="flex-1">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              WOOF AI Insight
            </Badge>
          </div>
          <p className="text-sm md:text-base italic text-[#223047] opacity-70" style={{ lineHeight: "1.6" }}>
            "Cappuccino maintains top position. <span className="hidden sm:inline">Consider bundling with grooming services during 2-5 PM window for 18% lift potential.</span>"
          </p>
        </div>
        <img
          src={cafeMascot.src}
          alt="Cafe Mascot"
          className="w-24 h-24 md:w-32 md:h-32 object-contain flex-shrink-0 ml-4 md:ml-6"
        />
      </div>

      {/* MENU PERFORMANCE + HAPPY HOUR */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Menu Item Performance Table (60% - 3 columns) */}
        <div className="lg:col-span-3 bg-white border border-[#FFD9EC] rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg md:text-xl lg:text-[22px] font-bold text-[#223047]">
              Menu Item Performance
            </h2>
            <select
              value={menuFilter}
              onChange={(e) => setMenuFilter(e.target.value)}
              className="px-3 py-1.5 border border-[#FFD9EC] rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#F53799]"
            >
              <option value="all">All Items</option>
              <option value="top">Top Performers</option>
              <option value="under">Underperformers</option>
              <option value="diverging">Diverging</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-[#FFF2FA]"
                    onClick={() => handleSort("name")}
                  >
                    Item Name {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-[#FFF2FA] text-center"
                    onClick={() => handleSort("physical")}
                  >
                    Physical {sortColumn === "physical" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-[#FFF2FA] text-center"
                    onClick={() => handleSort("online")}
                  >
                    Online {sortColumn === "online" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                  <TableHead className="text-center">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMenuItems.map((item, itemIndex) => (
                  <React.Fragment key={`menu-item-${item.name}-${itemIndex}`}>
                    <TableRow
                      className="cursor-pointer hover:bg-[#FFF2FA]"
                      onClick={() => setExpandedRow(expandedRow === item.name ? null : item.name)}
                    >
                      <TableCell className="font-semibold">{item.name}</TableCell>
                      <TableCell className="text-center">{item.physicalSales}</TableCell>
                      <TableCell className="text-center">{item.onlineSales}</TableCell>
                      <TableCell className="text-center">
                        <div className={`w-2 h-2 rounded-full mx-auto ${getEquilibriumColor(item.equilibrium)}`} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center h-8">
                          <LineChart width={80} height={30} data={item.trend.map((v, idx) => ({ value: v, index: idx }))}>
                            <Line
                              key={`line-trend-${item.name}`}
                              type="monotone"
                              dataKey="value"
                              stroke="#F53799"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">{item.margin}%</TableCell>
                    </TableRow>
                    {expandedRow === item.name && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-[#FFF7FB]">
                          <div className="p-4 space-y-3">
                            <ResponsiveContainer width="100%" height={120} className="md:!h-[150px]">
                              <LineChart
                                data={Array.from({ length: 14 }, (_, i) => ({
                                  day: `Day ${i + 1}`,
                                  sales: Math.random() * 100 + 50,
                                }))}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#FFD9EC" />
                                <XAxis dataKey="day" style={{ fontSize: "10px" }} />
                                <YAxis style={{ fontSize: "10px" }} />
                                <Tooltip />
                                <Line
                                  key={`line-sales-${item.name}`}
                                  type="monotone"
                                  dataKey="sales"
                                  stroke="#F53799"
                                  strokeWidth={2}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                            <Button size="sm" className="bg-[#F53799] hover:bg-[#D42A7D] text-xs md:text-sm">
                              Promote This Item
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Happy Hour Optimizer (40% - 2 columns) */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="bg-[#223047] text-white rounded-2xl md:rounded-3xl p-4 md:p-6 space-y-3 md:space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base md:text-lg font-bold">Next Quiet Period</h3>
              <Badge className="bg-[#5CE1E6] text-white hover:bg-[#5CE1E6] text-xs">
                ⚙ ENGINE
              </Badge>
            </div>

            <div className="text-2xl md:text-3xl lg:text-4xl font-bold">Tomorrow 3:00 PM</div>

            <div className="flex items-center gap-2 text-xs md:text-sm">
              <span className="opacity-70">Predicted Traffic:</span>
              <span className="font-semibold text-[#3AE4FA]">42% below avg</span>
            </div>

            <div className="space-y-3 pt-2 md:pt-4">
              <div>
                <label className="text-xs opacity-70 mb-2 block">Discount %</label>
                <div className="flex items-center gap-3">
                  <Slider
                    value={discountValue}
                    onValueChange={setDiscountValue}
                    max={50}
                    min={5}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-base md:text-lg font-bold w-10 md:w-12">{discountValue[0]}%</span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-[#F53799] hover:bg-[#D42A7D] text-xs md:text-sm">
              Activate Happy Hour
            </Button>
          </div>

          <div className="bg-white border border-[#FFD9EC] rounded-2xl md:rounded-3xl p-4 md:p-6 space-y-3 md:space-y-4">
            <h3 className="text-sm md:text-base font-bold text-[#223047]">Past Happy Hour Effectiveness</h3>

            <div className="space-y-2">
              {[
                { date: "Apr 12", predicted: "+15%", actual: "+18%", result: "✓" },
                { date: "Apr 10", predicted: "+12%", actual: "+14%", result: "✓" },
                { date: "Apr 8", predicted: "+20%", actual: "+16%", result: "~" },
                { date: "Apr 6", predicted: "+18%", actual: "+22%", result: "✓" },
              ].map((item) => (
                <div
                  key={item.date}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#FFF2FA]"
                >
                  <span className="text-xs text-[#223047] opacity-60">{item.date}</span>
                  <span className="text-xs font-medium text-[#223047]">
                    {item.predicted} → {item.actual}
                  </span>
                  <span className="text-sm">{item.result}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 md:pt-4 border-t border-[#FFD9EC]">
              <p className="text-xs text-[#223047] opacity-60 mb-2 md:mb-3">Was this helpful?</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs md:text-sm">
                  👍 <span className="hidden sm:inline ml-1">Yes</span>
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs md:text-sm">
                  👎 <span className="hidden sm:inline ml-1">No</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEW SENTIMENT MONITOR */}
      <div className="bg-white border border-[#FFD9EC] rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
        <div>
          <h2 className="text-lg md:text-xl lg:text-[22px] font-bold text-[#223047]">
            Cafe Review Sentiment Monitor
          </h2>
          <p className="text-xs md:text-sm text-[#223047] opacity-60 mt-1" style={{ lineHeight: "1.6" }}>
            NLP analysis of Shopee & Tiktok reviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Sentiment Donut */}
          <div className="flex flex-col items-center justify-center py-4 md:py-0">
            <div className="relative w-full max-w-[240px] md:max-w-[280px] mx-auto">
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-[#223047]">78%</div>
                <div className="text-xs text-[#223047] opacity-60">Positive</div>
              </div>
            </div>
          </div>

          {/* Flagged Review Feed */}
          <div className="md:col-span-2 space-y-3 max-h-[300px] overflow-y-auto overflow-x-hidden">
            {flaggedReviews.map((review, idx) => (
              <div key={idx} className="p-3 md:p-4 bg-[#FFF7FB] border border-[#FFD9EC] rounded-lg md:rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{review.platform}</Badge>
                  <span className="text-xs text-[#223047] opacity-50">{review.date}</span>
                </div>
                <p className="text-xs md:text-sm text-[#223047]" style={{ lineHeight: "1.6" }}>
                  {review.text.split(" ").map((word, i) =>
                    review.keywords.some((kw) => word.toLowerCase().includes(kw)) ? (
                      <span key={`word-${idx}-${i}`} className="font-bold text-[#F53799]">
                        {word}{" "}
                      </span>
                    ) : (
                      <span key={`word-${idx}-${i}`}>{word} </span>
                    )
                  )}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#223047] opacity-60">{review.product}</span>
                  <Button size="sm" variant="outline" className="border-[#F53799] text-[#F53799] text-xs">
                    <span className="hidden sm:inline">Flag for Inspection</span>
                    <span className="sm:hidden">Flag</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyword Management */}
        <div className="pt-4 md:pt-6 border-t border-[#FFD9EC] space-y-3">
          <h3 className="text-xs md:text-sm font-semibold text-[#223047]">Negative Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="outline"
                className="gap-2 border-[#FFD9EC] bg-[#FFF2FA] text-xs"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:text-[#F53799]"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddKeyword();
                }
              }}
              placeholder="Add new keyword..."
              className="flex-1 px-3 md:px-4 py-2 border border-[#FFD9EC] rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#F53799]"
            />
            <Button onClick={handleAddKeyword} className="bg-[#F53799] hover:bg-[#D42A7D] text-xs md:text-sm px-3 md:px-4">
              <span className="hidden sm:inline">Add Keyword</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {errorModal.type && (
        <ErrorModal
          isOpen={errorModal.isOpen}
          onClose={() => setErrorModal({ isOpen: false, type: null })}
          errorType={errorModal.type}
          onRetry={() => {
            if (errorModal.type === "export_failed") {
              handleRetryExport();
            } else if (errorModal.type === "data_sync_failed") {
              handleRetryDataSync();
            }
          }}
          onViewDetails={errorModal.type === "model_failed" ? handleViewModelDetails : undefined}
          onContactSupport={errorModal.type === "data_corruption" ? handleContactSupport : undefined}
          onRefresh={errorModal.type === "concurrent_modification" ? handleRefreshData : undefined}
        />
      )}

      {/* Success Modal */}
      {successModal.type && (
        <SuccessModal
          isOpen={successModal.isOpen}
          onClose={() => setSuccessModal({ isOpen: false, type: null })}
          successType={successModal.type}
        />
      )}

      {/* Model Details Modal */}
      <ModelDetailsModal
        isOpen={showModelDetails}
        onClose={() => setShowModelDetails(false)}
      />
    </div>
  );
}