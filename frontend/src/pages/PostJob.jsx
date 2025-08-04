import { useState, useEffect } from "react"
import { DollarSign, MapPin, Clock, Wallet, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PostJob() {
  const [currentStep, setCurrentStep] = useState(1)
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    skills: [],
    budget: "",
    location: "",
    type: "",
    currency: "SOL"
  })

  const steps = [
    { number: 1, title: "Job Details", description: "Basic information about the position" },
    { number: 2, title: "Payment", description: "Connect wallet and pay posting fee" },
    { number: 3, title: "Confirmation", description: "Review and publish your job" }
  ]

  const skillOptions = [
    "React", "TypeScript", "Node.js", "Python", "Solana", "Ethereum", "Web3",
    "JavaScript", "Rust", "Smart Contracts", "DeFi", "UI/UX Design"
  ]

  const handleSkillToggle = (skill) => {
    setJobData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');

  useEffect(() => {
    if (currentStep === 2) {
      checkWalletConnection();
    }
  }, [currentStep]);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
          fetchBalance(accounts[0]);
        } else {
          setWalletConnected(false);
          setWalletAddress('');
          setWalletBalance('');
        }
      } catch (error) {
        console.error('Error checking wallet connection', error);
      }
    }
  };

  const fetchBalance = async (address) => {
    if (!window.ethereum) return;

    if (jobData.currency === 'ETH' || jobData.currency === 'MATIC') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balanceBigNumber = await provider.getBalance(address);
        const balanceInEth = ethers.utils.formatEther(balanceBigNumber);
        setWalletBalance(parseFloat(balanceInEth).toFixed(4));
      } catch (error) {
        console.error('Error fetching balance', error);
        setWalletBalance('');
      }
    } else if (jobData.currency === 'SOL') {
      setWalletBalance('0'); // SOL balance fetch requires another approach
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        fetchBalance(accounts[0]);
        console.log('Wallet Address:', accounts[0]);
      } catch (error) {
        console.error('Connection Error:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Post a Job</h1>
        <p className="text-muted-foreground">Find the perfect candidate for your team</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-8 mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.number
                  ? "bg-primary border-primary text-white"
                  : "border-border text-muted-foreground"
                }`}>
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? "bg-primary" : "bg-border"
                }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Job Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Frontend Developer"
                    value={jobData.title}
                    onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type *</Label>
                  <Select value={jobData.type} onValueChange={(value) => setJobData({ ...jobData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={jobData.description}
                  onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget/Salary *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget"
                      placeholder="e.g. 80k - 120k or $50/hour"
                      value={jobData.budget}
                      onChange={(e) => setJobData({ ...jobData, budget: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g. San Francisco, CA or Remote"
                      value={jobData.location}
                      onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="flex flex-wrap gap-2 p-4 bg-secondary rounded-lg">
                  {skillOptions.map((skill) => (
                    <Badge
                      key={skill}
                      variant={jobData.skills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-white"
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                {jobData.skills.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {jobData.skills.join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Wallet className="h-16 w-16 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground">
                  Connect your wallet to pay the job posting fee and receive payments
                </p>
              </div>

              {!walletConnected ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-16 flex flex-col" onClick={connectWallet}>
                      <div className="w-8 h-8 bg-purple-100 rounded-full mb-2 flex items-center justify-center">
                        <span className="text-purple-600 font-bold">P</span>
                      </div>
                      Phantom Wallet
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col" onClick={connectWallet}>
                      <div className="w-8 h-8 bg-orange-100 rounded-full mb-2 flex items-center justify-center">
                        <span className="text-orange-600 font-bold">M</span>
                      </div>
                      MetaMask
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">Wallet Connected</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      Balance: {walletBalance} {jobData.currency}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Currency</Label>
                      <Select
                        value={jobData.currency}
                        onValueChange={(value) => {
                          setJobData({ ...jobData, currency: value });
                          fetchBalance(walletAddress);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SOL">Solana (SOL)</SelectItem>
                          <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          <SelectItem value="MATIC">Polygon (MATIC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Card className="p-4 bg-secondary">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Platform Fee</span>
                        <span className="font-bold">0.01 {jobData.currency}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Processing Fee</span>
                        <span>0.002 {jobData.currency}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between items-center font-bold">
                        <span>Total</span>
                        <span>0.012 {jobData.currency}</span>
                      </div>
                    </Card>

                    <Button variant="gradient" className="w-full" size="lg">
                      Pay Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
                <p className="text-muted-foreground">
                  Your job has been posted successfully
                </p>
              </div>

              <Card className="p-6 bg-secondary">
                <h4 className="font-semibold mb-4">Job Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{jobData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{jobData.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-medium">{jobData.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{jobData.location}</span>
                  </div>
                </div>
              </Card>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Transaction Hash:</strong> 0x1234567890abcdef...
                </p>
                <Button variant="link" className="text-blue-600 p-0 h-auto mt-2">
                  View on Explorer
                </Button>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1">
                  View My Jobs
                </Button>
                <Button variant="gradient" className="flex-1">
                  Post Another Job
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button
              variant="gradient"
              onClick={handleNext}
              disabled={
                currentStep === 1 && (!jobData.title || !jobData.description || !jobData.budget || !jobData.location) ||
                currentStep === 2 && !walletConnected ||
                currentStep === 3
              }
            >
              {currentStep === 3 ? "Complete" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}