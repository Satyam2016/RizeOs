import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import {
  Eye, EyeOff, Mail, Lock, User, CheckCircle,
  AlertCircle, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"


export default function Auth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authState, setAuthState] = useState("auth")
  const [verificationStatus, setVerificationStatus] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeToTerms: false
  })

  useEffect(() => {
    const token = searchParams.get("token")
    const userId = searchParams.get("id")

    if (token && userId) {
      setAuthState("verify-email")
      localStorage.setItem("token", token);
      localStorage.setItem("id", userId);
      verifyEmail(token, userId)
    }
  }, [ ])

  const verifyEmail = async (token, id) => {
    console.log("token ", token)
    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/verify-email?token=${token}&id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        
      })
      const data = await res.json(); 
      console.log("response  ",data.message)
    if (data.message != "Email verified successfully") {
      throw new Error("Verification failed");
    }

    setVerificationStatus("success");

    toast({
      title: "Email Verified!",
      description: "Your email has been successfully verified. You can now log in.",
    });

     setTimeout(() => {
      navigate("/auth");
      setAuthState("auth");
    }, 3000);
    
   
  } catch (error) {
      console.log("error  ", error)
      setVerificationStatus("error")
      toast({
        title: "Verification Failed",
        description: "The verification link is invalid or has expired.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    const password = formData.password.trim()
    const confirmPassword = formData.confirmPassword.trim()

    console.log("pass ", password);
    console.log("cpass ", confirmPassword);

    if ( password !== confirmPassword) {
      console.log("inside pass match")
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      setAuthState("email-sent")
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", data.user)

    if (response.status === 401) {
      toast({
        title: "Login Failed",
        description: "Please verify your email before logging in",
      });
      return;
    }

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    toast({
      title: "Login Successful",
      description: "Welcome back to WorkChain!",
    });

    navigate("/");
  } catch (error) {
    toast({
      title: "Login Failed",
      description: error.message || "Invalid email or password.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  //resendVerificationEmail
  const resendVerificationEmail = async () => {
    setIsLoading(true)
   try {
      const response = await fetch("http://localhost:3000/api/auth/resendVerificationEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      setAuthState("email-sent")
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  // Email Verification Page
  if (authState === 'verify-email') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
        <Card className="w-full max-w-md shadow-strong border-white/20 bg-white/10 backdrop-blur-glass">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {verificationStatus === 'loading' && (
              <>
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-white" />
                <p className="text-white/80">Verifying your email...</p>
              </>
            )}

            {verificationStatus === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 mx-auto text-green-400" />
                <div className="space-y-2">
                  <p className="text-white font-medium">Email Verified Successfully!</p>
                  <p className="text-white/80 text-sm">
                    You will be redirected to login shortly.
                  </p>
                </div>
              </>
            )}

            {verificationStatus === 'error' && (
              <>
                <AlertCircle className="h-12 w-12 mx-auto text-red-400" />
                <div className="space-y-2">
                  <p className="text-white font-medium">Verification Failed</p>
                  <p className="text-white/80 text-sm">
                    The verification link is invalid or has expired.
                  </p>
                </div>
                <Button
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => {
                    navigate('/auth')
                    setAuthState('auth')
                  }}
                >
                  Back to Login
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Email Sent Confirmation Page
  if (authState === 'email-sent') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
        <Card className="w-full max-w-md shadow-strong border-white/20 bg-white/10 backdrop-blur-glass">
          <CardHeader className="text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-white" />
            <CardTitle className="text-2xl font-bold text-white">Check Your Email</CardTitle>
            <p className="text-white/80">
              We have sent a verification link to {formData.email}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-white/20 bg-white/10">
              <AlertCircle className="h-4 w-4 text-white" />
              <AlertDescription className="text-white/80">
                Click the link in your email to verify your account. The link will expire in 24 hours.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button
                variant="glass"
                className="w-full"
                onClick={resendVerificationEmail}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Resend Verification Email
              </Button>

              <Button
                variant="ghost"
                className="w-full text-white/80 hover:text-white"
                onClick={() => setAuthState('auth')}
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main Auth Page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-glass rounded-2xl mb-4">
            <span className="text-2xl font-bold text-white">W</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">WorkChain</h1>
          <p className="text-white/80">Your professional Web3 network</p>
        </div>

        {/* Auth Form */}
        <Card className="shadow-strong border-white/20 bg-white/10 backdrop-blur-glass">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-blue-500 data-[state=active]:text-foreground">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white data-[state=active]:bg-blue-500 data-[state=active]:text-foreground">
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/60 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => handleInputChange("rememberMe", checked)}
                        className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-primary"
                      />
                      <Label htmlFor="remember-me" className="text-sm text-white/80">
                        Remember me
                      </Label>
                    </div>
                    <Button variant="link" className="text-white/80 hover:text-white p-0 h-auto">
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-white text-primary hover:bg-white/90"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-white">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/60 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-10 pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/60 hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agree-terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                      className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-primary"
                    />
                    <Label htmlFor="agree-terms" className="text-sm text-white/80">
                      I agree to the{" "}
                      <Button variant="link" className="text-white hover:text-white/80 p-0 h-auto underline">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="text-white hover:text-white/80 p-0 h-auto underline">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-white text-primary hover:bg-white/90"
                    size="lg"
                    disabled={!formData.agreeToTerms || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-white/60">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button variant="glass" className="w-full">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
                <Button variant="glass" className="w-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}