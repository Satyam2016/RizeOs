import { useState } from "react"
import { Wallet, CreditCard, History, TrendingUp, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const sampleTransactions = [
  {
    id: "1",
    type: "job_posting",
    description: "Job posting fee - Senior Frontend Developer",
    amount: -0.01,
    currency: "SOL",
    status: "completed",
    date: "2024-01-15",
    hash: "0x1234567890abcdef"
  },
  {
    id: "2",
    type: "payment_received",
    description: "Payment from TechCorp - Website Development",
    amount: 2.5,
    currency: "SOL",
    status: "completed",
    date: "2024-01-14",
    hash: "0xabcdef1234567890"
  },
  {
    id: "3",
    type: "platform_fee",
    description: "Platform service fee",
    amount: -0.005,
    currency: "SOL",
    status: "completed",
    date: "2024-01-14"
  },
  {
    id: "4",
    type: "withdrawal",
    description: "Withdrawal to external wallet",
    amount: -1.0,
    currency: "SOL",
    status: "pending",
    date: "2024-01-13"
  }
]

export default function Payments() {
  const [transactions] = useState(sampleTransactions)
  const [filterType, setFilterType] = useState("all")
  const [walletConnected] = useState(true)

  const filteredTransactions = transactions.filter(transaction => 
    filterType === "all" || transaction.type === filterType
  )

  const totalBalance = transactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalEarnings = transactions
    .filter(t => t.type === "payment_received" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalSpent = transactions
    .filter(t => (t.type === "job_posting" || t.type === "platform_fee") && t.status === "completed")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const getTransactionIcon = (type) => {
    switch (type) {
      case "job_posting": return "💼"
      case "payment_received": return "💰"
      case "withdrawal": return "📤"
      case "platform_fee": return "⚙️"
      default: return "💳"
    }
  }

  const getStatusColor = ( status ) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "failed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments & Wallet</h1>
          <p className="text-muted-foreground">Manage your blockchain payments and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="gradient">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </div>

      {/* Wallet Status */}
      {walletConnected && (
        <Card className="shadow-soft border-border/50 bg-gradient-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Phantom Wallet Connected</h3>
                <p className="text-white/80 text-sm">0x1234...abcd</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{totalBalance.toFixed(3)} SOL</p>
                <p className="text-white/80 text-sm">≈ $128.50 USD</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalEarnings.toFixed(3)} SOL</div>
            <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalSpent.toFixed(3)} SOL</div>
            <p className="text-xs text-muted-foreground mt-1">Job postings & fees</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
            <History className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{transactions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="job_posting">Job Postings</SelectItem>
                  <SelectItem value="payment_received">Payments Received</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="platform_fee">Platform Fees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getTransactionIcon(transaction.type)}</div>
                  <div>
                    <h4 className="font-medium text-foreground">{transaction.description}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      <Badge variant="outline" className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                      {transaction.hash && (
                        <Button variant="link" className="text-xs p-0 h-auto">
                          View on Explorer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(3)} {transaction.currency}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ≈ ${(Math.abs(transaction.amount) * 42.5).toFixed(2)} USD
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col">
              <Wallet className="h-6 w-6 mb-2" />
              Connect New Wallet
            </Button>
            <Button variant="outline" className="h-16 flex flex-col">
              <Download className="h-6 w-6 mb-2" />
              Withdraw Funds
            </Button>
            <Button variant="outline" className="h-16 flex flex-col">
              <CreditCard className="h-6 w-6 mb-2" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}