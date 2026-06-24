'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, Check, Link2, QrCode, Mail, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Transaction {
  timestamp: string;
  txHash: string;
  gasUsed: number;
  gasPriceGwei: number;
  feeEth: number;
  feeRp: number;
}

interface ShareAnalysisProps {
  transactions: Transaction[];
  bankFee: number;
  otaCommission: number;
  adminFee: number;
  baseAmount: number;
}

export function ShareAnalysis({ 
  transactions, 
  bankFee, 
  otaCommission, 
  adminFee,
  baseAmount 
}: ShareAnalysisProps) {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [shareCode, setShareCode] = useState<string>('');

  useEffect(() => {
    // Generate share code and URL
    generateShareUrl();
  }, [transactions, bankFee, otaCommission, adminFee, baseAmount]);

  const generateShareUrl = () => {
    // Create a compressed state object
    const state = {
      t: transactions.length, // transaction count
      b: bankFee,
      o: otaCommission,
      a: adminFee,
      ba: baseAmount,
      ts: Date.now() // timestamp
    };

    // Encode to base64
    const encoded = btoa(JSON.stringify(state));
    const code = encoded.substring(0, 12); // Short code
    
    setShareCode(code);
    
    // Generate full URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}?share=${encoded}`;
    setShareUrl(url);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('STC GasX Analysis - Web3 Cost Comparison');
    const body = encodeURIComponent(
      `Check out my Web3 cost comparison analysis on STC GasX!\n\n` +
      `Analysis Summary:\n` +
      `- Transactions: ${transactions.length}\n` +
      `- Bank Fee: Rp ${bankFee.toLocaleString('id-ID')}\n` +
      `- OTA Commission: ${otaCommission}%\n` +
      `- Admin Fee: Rp ${adminFee.toLocaleString('id-ID')}\n\n` +
      `View full analysis: ${shareUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `🔥 Check out my Web3 cost analysis on STC GasX!\n\n` +
      `📊 ${transactions.length} transactions analyzed\n` +
      `💰 Comparing on-chain vs off-chain costs\n\n` +
      `View analysis: ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`);
  };

  const shareViaTelegram = () => {
    const text = encodeURIComponent(
      `🔥 STC GasX Analysis\n\n` +
      `📊 ${transactions.length} transactions\n` +
      `View my Web3 cost comparison: ${shareUrl}`
    );
    window.open(`https://t.me/share/url?url=${shareUrl}&text=${text}`);
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(
      `Just analyzed ${transactions.length} Web3 transactions with STC GasX! 🔥\n\n` +
      `Comparing on-chain gas fees vs traditional payment costs.\n\n` +
      `Check it out:`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-purple-500 dark:bg-purple-600">
              <Share2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Share Your Analysis
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Collaborate and share your cost comparison with others
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
          <CardDescription>
            Overview of your current analysis parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {transactions.length}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-muted-foreground">Bank Fee</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                Rp {bankFee.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-muted-foreground">OTA Commission</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {otaCommission}%
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-muted-foreground">Admin Fee</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                Rp {adminFee.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Link */}
      <Card>
        <CardHeader>
          <CardTitle>Shareable Link</CardTitle>
          <CardDescription>
            Copy this link to share your analysis with anyone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shareUrl">Full URL</Label>
            <div className="flex gap-2">
              <Input
                id="shareUrl"
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(shareUrl)}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shareCode">Short Code</Label>
            <div className="flex gap-2">
              <Input
                id="shareCode"
                value={shareCode}
                readOnly
                className="font-mono text-lg font-bold"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(shareCode)}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this code with others - they can paste it to load your analysis
            </p>
          </div>

          {copied && (
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-900 dark:text-green-100">
                Copied to clipboard! Share it with your team.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Share via Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Share via Social Media</CardTitle>
          <CardDescription>
            Share your analysis on social platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={shareViaWhatsApp}
          >
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <p className="font-medium">Share via WhatsApp</p>
              <p className="text-xs text-muted-foreground">
                Send to your contacts or groups
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={shareViaTelegram}
          >
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <p className="font-medium">Share via Telegram</p>
              <p className="text-xs text-muted-foreground">
                Send to Telegram contacts
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={shareViaTwitter}
          >
            <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900">
              <Share2 className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="text-left">
              <p className="font-medium">Share via Twitter</p>
              <p className="text-xs text-muted-foreground">
                Post to your Twitter timeline
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={shareViaEmail}
          >
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
              <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-left">
              <p className="font-medium">Share via Email</p>
              <p className="text-xs text-muted-foreground">
                Send detailed analysis via email
              </p>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Sharing Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
              1
            </Badge>
            <div>
              <p className="font-medium">Copy Your Link or Code</p>
              <p className="text-sm text-muted-foreground">
                Use the shareable link or short code above
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
              2
            </Badge>
            <div>
              <p className="font-medium">Share with Others</p>
              <p className="text-sm text-muted-foreground">
                Send via social media, email, or messaging apps
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
              3
            </Badge>
            <div>
              <p className="font-medium">They View Your Analysis</p>
              <p className="text-sm text-muted-foreground">
                Recipients can see your exact cost comparison parameters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
