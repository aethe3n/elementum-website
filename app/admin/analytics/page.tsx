'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getSubscriptionMetrics, getRevenueByPlan } from '@/lib/services/analyticsService';
import { getTopUsers } from '@/lib/services/usageService';
import type { SubscriptionMetrics } from '@/lib/services/analyticsService';
import type { UsageMetrics } from '@/lib/services/usageService';

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<SubscriptionMetrics | null>(null);
  const [revenueByPlan, setRevenueByPlan] = useState<Record<string, number>>({});
  const [topUsers, setTopUsers] = useState<Array<{ userId: string; usage: UsageMetrics }>>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [metricsData, revenueData, usageData] = await Promise.all([
        getSubscriptionMetrics(dateRange.startDate, dateRange.endDate),
        getRevenueByPlan(),
        getTopUsers(5)
      ]);

      setMetrics(metricsData);
      setRevenueByPlan(revenueData);
      setTopUsers(usageData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#B87D3B]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-white mb-2">Subscription Analytics</h1>
        <p className="text-neutral-400">Monitor your subscription metrics and user engagement</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-light">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">${metrics?.totalRevenue.toFixed(2)}</div>
            <p className="text-neutral-400 text-sm mt-2">Monthly recurring revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-light">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">{metrics?.activeSubscriptions}</div>
            <p className="text-neutral-400 text-sm mt-2">Current active subscribers</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-light">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">{metrics?.churnRate.toFixed(1)}%</div>
            <p className="text-neutral-400 text-sm mt-2">Monthly churn rate</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-light">Average Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">${metrics?.averageRevenue.toFixed(2)}</div>
            <p className="text-neutral-400 text-sm mt-2">Per active subscription</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-light">Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(revenueByPlan).map(([plan, revenue]) => (
                <div key={plan} className="flex justify-between items-center">
                  <span className="text-neutral-400">{plan}</span>
                  <span className="text-white">${revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 backdrop-blur-lg border-neutral-800 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-light">Top Users by API Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.map(({ userId, usage }) => (
                <div key={userId} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">User ID: {userId.slice(0, 8)}...</span>
                    <span className="text-white">{usage.apiCalls} calls</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#B87D3B] h-full rounded-full"
                      style={{
                        width: `${Math.min((usage.apiCalls / 10000) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          variant="outline"
          className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B] hover:text-white"
          onClick={loadData}
        >
          Refresh Data
        </Button>
      </div>
    </div>
  );
} 