import { useState, useEffect } from "react"
import {
  MapPin,
  Mail,
  Calendar,
  Edit,
  Camera,
  ExternalLink,
  Award,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import axios from "axios"

export default function Profile() {

  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState()
  const [activeModal, setActiveModal] = useState(null);
  const [modalInput, setModalInput] = useState({});


  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios
        .get("http://localhost:3000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setProfile(res.data.user.profile))
        .catch(() => setProfile(null))
    }
  }, [])

  const stats = [
    { label: "Projects Completed", value: "15", icon: Briefcase },
    { label: "Years Experience", value: "5+", icon: Calendar },
    { label: "Skills Mastered", value: "12", icon: Award },
    { label: "Client Rating", value: "4.9", icon: Award },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="shadow-soft border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            {/* Avatar Section */}
            <div className="border-2 rounded-full relative mb-4 md:mb-0">
              <Avatar className="h-32 w-32 mx-auto md:mx-0">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gray-100 text-gray-500 text-2xl text-center">
                  {profile?.name.split(" ").map(n => n[0]).join('') || "N/A"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white shadow-medium"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profile?.name || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={profile?.title || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, title: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile?.bio || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile?.location || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {profile?.name || (
                      <span className="text-gray-400">Not available</span>
                    )}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-4">
                    {profile?.title || (
                      <span className="text-gray-400">Not available</span>
                    )}
                  </p>
                  <p className="text-foreground leading-relaxed mb-4">
                    {profile?.bio || (
                      <span className="text-gray-400">Not available</span>
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-muted-foreground">
                    <span className="flex items-center justify-center sm:justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      {profile?.location || (
                        <span className="text-gray-400">Not available</span>
                      )}
                    </span>
                    <span className="flex items-center justify-center sm:justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      {profile?.email || (
                        <span className="text-gray-400">Not available</span>
                      )}
                    </span>
                    <span className="flex items-center justify-center sm:justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      {profile?.joinDate ? (
                        `Joined ${new Date(profile.joinDate).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric", })}`
                      ) : (
                        <span className="text-gray-400">
                          Join date not available
                        </span>
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 mt-4 md:mt-0">
              {isEditing ? (
                <>
                  <Button
                    variant="gradient"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token")
                        const res = await axios.put(
                      "http://localhost:3000/api/users/profile",
                      { profile: profile },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                      

                      
                          setProfile(profile); // Update UI
                          setIsEditing(false);
                
                      } catch (err) {
                        console.error("Request failed:", err);
                        alert("Something went wrong.");
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="gradient" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-soft border-border/50">
            <CardContent className="p-4 text-center">
              <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Content Tabs */}
      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Skills & Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.length ? (
                  profile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-sm py-1 px-3"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400">No skills listed</span>
                )}
                <Button variant="outline" size="sm" className="h-8" onClick={() => setActiveModal("skill")}>
                  + Add Skill
                </Button>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile?.experience?.length ? (
                profile.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-primary pl-6 relative"
                  >
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
                    <h3 className="font-semibold text-foreground">
                      {exp.title || (
                        <span className="text-gray-400">No title</span>
                      )}
                    </h3>
                    <p className="text-primary font-medium">
                      {exp.company || (
                        <span className="text-gray-400">No company</span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {exp.period || (
                        <span className="text-gray-400">No period</span>
                      )}
                    </p>
                    <p className="text-foreground">
                      {exp.description || (
                        <span className="text-gray-400">No description</span>
                      )}
                    </p>
                  </div>
                ))
              ) : (
                <span className="text-gray-400">No work experience listed</span>
              )}
              <Button variant="outline" size="sm" onClick={() => setActiveModal("experience")}>
                + Add Experience
              </Button>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Achievements & Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile?.achievements?.length ? (
                  profile.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-secondary rounded-lg"
                    >
                      <Award className="h-5 w-5 text-primary" />
                      <span className="text-foreground">{achievement}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400">No achievements listed</span>
                )}
                <Button variant="outline" size="sm" onClick={() => setActiveModal("achievement")}>
                  + Add Achievement
                </Button>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Job Posting Fee
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Posted: Senior React Developer
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">0.01 SOL</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Premium Feature
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Boost job visibility
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">0.05 SOL</p>
                    <p className="text-sm text-muted-foreground">1 week ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View All Payments
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-center capitalize">Add {activeModal}</h2>

            {/* Show existing items */}
            {activeModal === "skill" && profile?.skills?.length > 0 && (
              <div className="space-y-1">
                <Label>Current Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {activeModal === "experience" && profile?.experience?.length > 0 && (
              <div className="space-y-1">
                <Label>Previous Experience</Label>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {profile.experience.map((e, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{e.title}</span> at{" "}
                      {e.company} ({e.period})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeModal === "achievement" && profile?.achievements?.length > 0 && (
              <div className="space-y-1">
                <Label>Previous Achievements</Label>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {profile.achievements.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* New input form */}
            {activeModal === "skill" && (
              <div>
                <Label htmlFor="skill">New Skill</Label>
                <Input
                  id="skill"
                  placeholder="e.g. Tailwind CSS"
                  value={modalInput.skill || ""}
                  onChange={(e) =>
                    setModalInput({ ...modalInput, skill: e.target.value })
                  }
                />
              </div>
            )}

            {activeModal === "experience" && (
              <div className="space-y-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={modalInput.title || ""}
                    onChange={(e) =>
                      setModalInput({ ...modalInput, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    value={modalInput.company || ""}
                    onChange={(e) =>
                      setModalInput({ ...modalInput, company: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input
                    value={modalInput.period || ""}
                    onChange={(e) =>
                      setModalInput({ ...modalInput, period: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={modalInput.description || ""}
                    onChange={(e) =>
                      setModalInput({ ...modalInput, description: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {activeModal === "achievement" && (
              <div>
                <Label htmlFor="achievement">New Achievement</Label>
                <Input
                  id="achievement"
                  placeholder="e.g. Google Cloud Certified"
                  value={modalInput.achievement || ""}
                  onChange={(e) =>
                    setModalInput({ ...modalInput, achievement: e.target.value })
                  }
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  let updatedProfile = { ...profile };

                  if (activeModal === "skill" && modalInput.skill?.trim()) {
                    updatedProfile.skills = [
                      ...(profile.skills || []),
                      modalInput.skill.trim(),
                    ];
                  } else if (activeModal === "experience" && modalInput.title?.trim()) {
                    updatedProfile.experience = [
                      ...(profile.experience || []),
                      {
                        title: modalInput.title.trim(),
                        company: modalInput.company?.trim() || "",
                        period: modalInput.period?.trim() || "",
                        description: modalInput.description?.trim() || "",
                      },
                    ];
                  } else if (activeModal === "achievement" && modalInput.achievement?.trim()) {
                    updatedProfile.achievements = [
                      ...(profile.achievements || []),
                      modalInput.achievement.trim(),
                    ];
                  }

                  try {
                    await axios.put(
                      "http://localhost:3000/api/users/profile",
                      { profile: updatedProfile },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    setProfile(updatedProfile);
                    setActiveModal(null);
                    setModalInput({});
                  } catch (err) {
                    console.error("Failed to update profile", err);
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}
