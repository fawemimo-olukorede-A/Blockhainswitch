import { ArrowRight, Shield, Zap, Globe, Users, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import rezoLogo from "@/assets/rezo-logo.png";
import networkBg from "@/assets/blockchain-network-bg.jpg";

const features = [
  {
    icon: Zap,
    title: "Real-time Settlement",
    description: "Process transactions in seconds with our high-speed blockchain infrastructure.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Enterprise-level encryption and compliance with Nigerian financial regulations.",
  },
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description: "Seamlessly route transactions across Ethereum, Polygon, and BSC networks.",
  },
  {
    icon: Users,
    title: "Universal Connectivity",
    description: "Connect banks, fintechs, and merchants on a single unified platform.",
  },
];

const stats = [
  { value: "₦50B+", label: "Transaction Volume" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.2s", label: "Avg. Settlement" },
  { value: "48+", label: "Connected Nodes" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src={rezoLogo} alt="ReZo" className="h-10 w-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ReZo
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${networkBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container relative px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              The Blockchain
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Transaction Switching Backbone
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Seamlessly route transactions across Nigerian banks, fintechs, and merchants with improved 
              transparency, reduced disputes, and full blockchain-fiat interoperability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 w-full sm:w-auto">
                  Access Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-border/50">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/40 bg-muted/30">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose ReZo?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for the Nigerian financial ecosystem, ReZo provides enterprise-grade 
              infrastructure for seamless transaction routing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30 border-y border-border/40">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Built for Nigerian Finance
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Integration with all major Nigerian banks",
                "Compliant with CBN regulations",
                "Naira and crypto settlement options",
                "24/7 transaction monitoring",
                "Dispute resolution system",
                "Real-time audit trails",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Transactions?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join the network of banks, fintechs, and merchants already using ReZo for seamless settlements.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={rezoLogo} alt="ReZo" className="h-8 w-8" />
              <span className="text-sm text-muted-foreground">© 2024 ReZo. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
