import { useState } from "react"
import { Search, Filter, MapPin, DollarSign, Clock, Bookmark, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect } from 'react'
import axios from 'axios'

// Removed the Job interface and type annotations

// const sampleJobs = [
//   {
//     id: "1",
//     title: "Senior Frontend Developer",
//     company: "TechFlow Inc.",
//     companyLogo: "/placeholder-avatar.jpg",
//     location: "San Francisco, CA",
//     type: "Full-time",
//     salary: "$120k - $180k",
//     postedTime: "2 hours ago",
//     description: "We're looking for a Senior Frontend Developer to join our team and help build the next generation of our platform using React, TypeScript, and modern web technologies.",
//     skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
//     applicants: 12,
//     verified: true
//   },
//   {
//     id: "2",
//     title: "Blockchain Developer",
//     company: "CryptoStart",
//     companyLogo: "/placeholder-avatar.jpg",
//     location: "Remote",
//     type: "Contract",
//     salary: "$80 - $120/hr",
//     postedTime: "5 hours ago",
//     description: "Join our team to build cutting-edge DeFi applications on Ethereum and Solana. Experience with smart contracts required.",
//     skills: ["Solidity", "Rust", "Web3.js", "Smart Contracts"],
//     applicants: 8,
//     verified: true
//   },
//   {
//     id: "3",
//     title: "UI/UX Designer",
//     company: "DesignLab",
//     companyLogo: "/placeholder-avatar.jpg",
//     location: "New York, NY",
//     type: "Full-time",
//     salary: "$90k - $130k",
//     postedTime: "1 day ago",
//     description: "We're seeking a creative UI/UX Designer to help design beautiful and intuitive user experiences for our Web3 applications.",
//     skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
//     applicants: 24,
//   },
//   {
//     id: "4",
//     title: "Full Stack Engineer",
//     company: "StartupXYZ",
//     companyLogo: "/placeholder-avatar.jpg",
//     location: "Austin, TX",
//     type: "Full-time",
//     salary: "$100k - $150k",
//     postedTime: "2 days ago",
//     description: "Looking for a versatile Full Stack Engineer to work on both frontend and backend systems. Experience with React and Node.js preferred.",
//     skills: ["React", "Node.js", "PostgreSQL", "AWS"],
//     applicants: 18,
//   }
// ]

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesLocation = locationFilter === "all" || !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesType = typeFilter === "all" || !typeFilter || job.type === typeFilter

    return matchesSearch && matchesLocation && matchesType
  })

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:3000/api/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(res.data);
      } catch (err) {
        setPosts([]);
      }
    };

    fetchJobs();
  }, [])



  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="bg-[#2894ea] rounded-2xl p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Find Your Dream Job</h1>
          <p className="text-white/80 mb-6">Discover opportunities in Web3, blockchain, and traditional tech</p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <Input
                placeholder="Search jobs, companies, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
              />
            </div>
            <div className="flex gap-2">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="san francisco">San Francisco</SelectItem>
                  <SelectItem value="new york">New York</SelectItem>
                  <SelectItem value="austin">Austin</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="glass" size="icon" className="md:hidden">
                    <Filter className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="san francisco">San Francisco</SelectItem>
                          <SelectItem value="new york">New York</SelectItem>
                          <SelectItem value="austin">Austin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Job Type</label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {filteredJobs.length} Jobs Found
          </h2>
          <Button variant="gradient">
            <ExternalLink className="h-4 w-4 mr-2" />
            Post a Job
          </Button>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job._id} className="bg-gray-200 shadow-soft border-border/50 hover:shadow-medium transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={job.companyLogo} />
                      <AvatarFallback className="bg-[#398dd3] text-white">
                        {job?.author?.profile.name.split(' ').map(word => word[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        {job.author?.profile.isVerified && <Badge variant="success" className="text-xs">Verified</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{job.author.profile.name}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="self-start">
                    {job.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="mb-2 text-muted-foreground">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.map((skill, i) => (
                    <Badge key={i} variant="outline">{skill}  </Badge>
                  ))}
                </div>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.budget}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(job.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric", })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bookmark className="h-4 w-4" />
                    <span>{job.applicants} applicants</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredJobs.length === 0 && (
            <p className="text-center text-muted-foreground mt-10">No jobs match your search and filter criteria.</p>
          )}
        </div>
      </div>
    </div>
  )
}
