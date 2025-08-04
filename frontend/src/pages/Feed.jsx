import { useState } from "react"
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import axios from 'axios'
import { useEffect } from "react"

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState();

  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState("text");

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:3000/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(res.data);
      } catch (err) {
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
          : post
      )
    );
  };

  const handleCreatePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const Tags = tags
        .split(/[\s,]+/)          // split by comma or space (1 or more)
        .map(tag => tag.trim())   // remove surrounding whitespace
        .filter(tag => tag);


      const postData = new URLSearchParams();
      postData.append("content", newPost.trim());
      postData.append("type", postType);
      postData.append("visibility", "public");
      postData.append("tags", Tags)
      // tags.forEach((tag) => postData.append("tags", tag));

      const res = await axios.post("http://localhost:3000/api/posts", postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("Post created:", res.data);
      setPosts(res.data);

      setNewPost("");
      setPostType("text");
      setTags([]);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };


  const getTypeColor = (type) => {
    switch (type) {
      case "achievement": return "bg-green-100 text-green-800"
      case "job_share": return "bg-blue-100 text-blue-800"
      case "article": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case "achievement": return "Achievement"
      case "job_share": return "Job Share"
      case "article": return "Article"
      default: return "Post"
    }
  }

  return (
    <div className=" max-w-2xl mx-auto space-y-6">
      {/* Create Post Card */}
      <Card className="shadow-soft border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-[#2894ea] text-white">You</AvatarFallback>
            </Avatar>
            <div className=" flex-1">
              <Textarea
                placeholder="Share your thoughts, achievements, or job opportunities..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="bg-gray-100 border-1  min-h-[80px] resize-none  shadow-none focus-visible:ring-0 text-base"
              />
              <br />
              <Textarea
                placeholder="Enter space-separated tags"
                value={tags}
                onChange={(e) => { setTags((e.target.value).split(" ").join()) }}
                className=" max-h-10 resize-none  focus-visible:ring-0 text-base"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant={postType === "text" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPostType("text")}
              >
                📝 Text
              </Button>
              <Button
                variant={postType === "job_share" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPostType("job_share")}
              >
                💼 Job
              </Button>
              <Button
                variant={postType === "article" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPostType("article")}
              >
                📖 Article
              </Button>
              <Button
                variant={postType === "achievement" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPostType("achievement")}
              >
                🏆 Achievement
              </Button>
            </div>
            <Button
              variant="gradient"
              className="bg-[#2894ea]"
              size="sm"
              disabled={!newPost.trim()}
              onClick={handleCreatePost}
            >
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts?.map((post) => (
          <Card key={post._id} className="bg-gray-100 shadow-soft border-border/50 hover:shadow-medium transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarImage className="" src={post?.author?.avatar} />
                    <AvatarFallback className="bg-[#2894ea] text-white">
                      {post.author?.profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-foreground">{post.author.profile.name}</h3>
                      {post.author?.profile.isVerified && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      <Badge variant="secondary" className={getTypeColor(post.type)}>
                        {getTypeLabel(post?.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{post.author.profile.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-2">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.timestamp}
                      </span>
                      {post.author.profile.location && (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {post.author.profile.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-200" align="end">
                    <DropdownMenuItem>Save post</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    <DropdownMenuItem>Hide</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">{post.content.text}</p>

              {post?.tags && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={post.liked ? "text-red-500 hover:text-red-600" : ""}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${post.liked ? "fill-current" : ""}`} />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    {post.shares}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
