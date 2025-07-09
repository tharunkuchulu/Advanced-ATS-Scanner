
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Upload, Target, BarChart3, Users, Zap, CheckCircle, Star, Brain, Shield, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Check if user is logged in (has token)
    const token = localStorage.getItem('token');
    if (token) {
      // User is logged in, redirect to dashboard
      navigate('/dashboard');
    } else {
      // User is not logged in, stay on home page (could also scroll to top)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "AI Resume Parsing",
      description: "Advanced NLP extracts skills, experiences, and insights from any resume format with 95% accuracy."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Job Matching",
      description: "Compare candidates with job descriptions from manual upload or LinkedIn/Indeed links."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Job Fit Scoring",
      description: "Get instant compatibility scores and detailed skill gap analysis for every candidate."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Resume Versioning",
      description: "Track resume history, filter by criteria, and maintain organized candidate records."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Export & Reports",
      description: "Generate PDF reports and export data to CSV for seamless workflow integration."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Bias-Free Assessment",
      description: "Ensure fair, compliant evaluations with our bias-mitigated AI algorithms."
    }
  ];

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "10x Faster Screening",
      description: "Reduce resume screening time from hours to minutes"
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "AI-Powered Insights",
      description: "Leverage advanced AI for accurate candidate assessment"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Bias-Free Analysis",
      description: "Ensure fair and objective candidate evaluation"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Real-Time Results",
      description: "Get instant analysis and matching results"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director at TechCorp",
      content: "SkillSync AI has revolutionized our hiring process. We've reduced screening time by 80% while improving candidate quality.",
      rating: 5
    },
    {
      name: "Michael Chen", 
      role: "Recruiting Manager at StartupXYZ",
      content: "The AI-powered matching is incredibly accurate. We're finding better candidates faster than ever before.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Talent Acquisition Lead",
      content: "The bulk processing feature is a game-changer for high-volume recruiting. Highly recommend!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                SkillSync AI
              </span>
            </button>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">About</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
                Your Privacy is Our Priority
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Sync Skills with
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                  Perfect Matches
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                AI-powered resume analysis that matches candidates with job requirements. Get instant fit scores, skill gap analysis, and actionable hiring insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500 px-8 py-4 text-lg backdrop-blur-sm"
                  >
                    Explore Dashboard
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-8 text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Your Privacy is Our Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>100% Free to Use</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-black/20 border-purple-500/20 p-6 text-center">
                <h3 className="text-3xl font-bold text-green-400 mb-2">95%</h3>
                <p className="text-gray-300">Match</p>
              </Card>
              <Card className="bg-black/20 border-purple-500/20 p-6 text-center">
                <h3 className="text-3xl font-bold text-blue-400 mb-2">10x</h3>
                <p className="text-gray-300">Faster Screening</p>
              </Card>
              <Card className="bg-black/20 border-purple-500/20 p-6 text-center">
                <h3 className="text-3xl font-bold text-purple-400 mb-2">50K+</h3>
                <p className="text-gray-300">Resumes Analyzed</p>
              </Card>
              <Card className="bg-black/20 border-purple-500/20 p-6 text-center">
                <h3 className="text-3xl font-bold text-cyan-400 mb-2">98%</h3>
                <p className="text-gray-300">Customer Satisfaction</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-blue-400 mb-2">95%</h3>
              <p className="text-gray-300">Parsing Accuracy</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-purple-400 mb-2">10x</h3>
              <p className="text-gray-300">Faster Screening</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-cyan-400 mb-2">50K+</h3>
              <p className="text-gray-300">Resumes Analyzed</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-green-400 mb-2">98%</h3>
              <p className="text-gray-300">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powerful AI-Driven Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Transform your hiring process with intelligent resume parsing, skill matching, and comprehensive candidate analysis.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/20 border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How SkillSync AI Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple, fast, and effective. Get started in just three easy steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Upload Resumes</h3>
              <p className="text-gray-300 text-lg">
                Upload individual resumes or process multiple candidates at once with our bulk upload feature.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Add Job Requirements</h3>
              <p className="text-gray-300 text-lg">
                Input job descriptions manually or extract them directly from LinkedIn, Indeed, and other job boards.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Get AI Insights</h3>
              <p className="text-gray-300 text-lg">
                Receive detailed analysis, matching scores, and actionable recommendations for each candidate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose SkillSync AI?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of HR professionals who trust SkillSync AI for their recruitment needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See how SkillSync AI is transforming recruitment for companies worldwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-black/20 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of recruiters using SkillSync AI to make better hiring decisions faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500 px-8 py-4 text-lg backdrop-blur-sm"
              >
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  SkillSync AI
                </span>
              </div>
              <p className="text-gray-400">
                Syncing candidate skills with job requirements through AI-powered analysis.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analysis</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Login</a></li>
              </ul>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">
                © 2024 SkillSync AI. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-4">
                Built by Tharun Vankayala • Powered by FastAPI + React + OpenRouter AI
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
