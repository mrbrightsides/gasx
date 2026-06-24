'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Upload, 
  Download, 
  Settings,
  Lightbulb,
  Target,
  Users,
  BookOpen
} from 'lucide-react'

export default function AboutSection() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">Rp</span>
          </div>
          <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            STC GasX
          </CardTitle>
          <p className="text-xl text-muted-foreground mt-2">
            Komparator Biaya Web3 vs Tradisional
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Analisis Biaya
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Web3 vs Tradisional
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Data Real-time
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* What is STC GasX */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Apa itu STC GasX?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              STC GasX adalah alat analisis yang membantu Anda <strong>membandingkan biaya transaksi</strong> antara:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-blue-600 dark:text-blue-400">Biaya On-Chain (Web3)</p>
                  <p className="text-sm text-muted-foreground">Gas fee Ethereum, biaya blockchain</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-orange-600 dark:text-orange-400">Biaya Off-Chain (Tradisional)</p>
                  <p className="text-sm text-muted-foreground">Transfer bank, biaya OTA, biaya admin</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Mengapa Penting?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Dengan memahami perbandingan biaya, Anda dapat:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <span className="text-sm">Menghemat biaya transaksi</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <span className="text-sm">Memahami tren biaya Web3</span>
              </li>
              <li className="flex items-start gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                <span className="text-sm">Membuat keputusan finansial yang tepat</span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                <span className="text-sm">Riset akademis dan analisis biaya</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Target Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            Untuk Siapa STC GasX?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-300">Peneliti</h3>
              <p className="text-sm text-muted-foreground">Mahasiswa, dosen, analyst</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-purple-700 dark:text-purple-300">Trader</h3>
              <p className="text-sm text-muted-foreground">Crypto trader, investor</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-green-700 dark:text-green-300">Bisnis</h3>
              <p className="text-sm text-muted-foreground">E-commerce, fintech</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-orange-700 dark:text-orange-300">Pengguna</h3>
              <p className="text-sm text-muted-foreground">Siapa saja yang ingin tahu</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Cara Menggunakan STC GasX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Lihat Data Real-time</h3>
                <p className="text-muted-foreground mb-2">
                  Panel atas menampilkan data terkini dari pasar crypto:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Harga ETH dalam USD dan IDR</li>
                  <li>• Gas price Ethereum terbaru</li>
                  <li>• Kurs USD ke Rupiah</li>
                </ul>
              </div>
            </div>

            <Separator />

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Analisis Perbandingan</h3>
                <p className="text-muted-foreground mb-2">
                  Tab <strong>"Perbandingan"</strong> menunjukkan:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <strong>Grafik Bar:</strong> Perbandingan biaya per transaksi</li>
                  <li>• <strong>Grafik Line:</strong> Tren gas fee vs biaya tradisional</li>
                  <li>• <strong>Pie Chart:</strong> Komposisi biaya (tab Breakdown)</li>
                </ul>
              </div>
            </div>

            <Separator />

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Atur Parameter</h3>
                <p className="text-muted-foreground mb-2">
                  Tab <strong>"Parameter"</strong> untuk menyesuaikan:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Biaya transfer bank (default: Rp 6.500)</li>
                  <li>• Komisi OTA dalam persen (default: 20%)</li>
                  <li>• Biaya admin tetap (default: Rp 25.000)</li>
                </ul>
              </div>
            </div>

            <Separator />

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Import & Export Data</h3>
                <p className="text-muted-foreground mb-2">
                  Tab <strong>"Data"</strong> memungkinkan Anda:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-3">
                  <div className="flex items-start gap-2">
                    <Upload className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Import CSV</p>
                      <p className="text-xs text-muted-foreground">Upload data dari STC Analytics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Download className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Export Hasil</p>
                      <p className="text-xs text-muted-foreground">Download CSV dan gambar grafik</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Fitur Unggulan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-700 dark:text-blue-300">Data Real-time</p>
                <p className="text-xs text-muted-foreground">Update otomatis dari API</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-purple-700 dark:text-purple-300">Visualisasi Lengkap</p>
                <p className="text-xs text-muted-foreground">3 jenis grafik interaktif</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-700 dark:text-green-300">Parameter Fleksibel</p>
                <p className="text-xs text-muted-foreground">Sesuaikan dengan kebutuhan</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-orange-700 dark:text-orange-300">Import CSV</p>
                <p className="text-xs text-muted-foreground">Data dari STC Analytics</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                <Download className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-indigo-700 dark:text-indigo-300">Export Hasil</p>
                <p className="text-xs text-muted-foreground">CSV dan gambar PNG</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">IDR</span>
              </div>
              <div>
                <p className="font-semibold text-teal-700 dark:text-teal-300">Mata Uang Lokal</p>
                <p className="text-xs text-muted-foreground">Konversi otomatis ke Rupiah</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              STC GasX dikembangkan untuk membantu memahami ekonomi Web3 vs tradisional
            </p>
            <p className="text-xs text-muted-foreground">
              Data real-time dari CoinGecko, Frankfurter API, dan Infura • Open source & gratis
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}