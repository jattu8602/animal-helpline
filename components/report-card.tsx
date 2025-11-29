"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, MapPin, Send } from "lucide-react";
import dynamic from "next/dynamic";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full bg-muted animate-pulse rounded-md" />,
});

interface ReportCardProps {
  report: any;
  isAdmin?: boolean;
}

export function ReportCard({ report, isAdmin }: ReportCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(report.likes?.length || 0);
  const [commentText, setCommentText] = useState("");
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleLike = async () => {
    // Optimistic update
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    toast.success(liked ? "Like removed" : "Liked!");
    // TODO: Call API to persist like
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmittingComment(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Comment posted successfully!");
      setCommentText("");
      setIsCommentDialogOpen(false);
      setIsSubmittingComment(false);
    }, 500);

    // TODO: Call API to post comment
  };

  const handleDonate = () => {
    toast.success("Donation request sent to Admin!", {
      description: `Your support request for this ${report.analysisResult?.animalType || "animal"} has been forwarded to the admin team.`,
      duration: 4000,
    });
  };

  const isInjured = report.analysisResult?.isInjured;
  const severity = report.analysisResult?.injuryDetails?.severity;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video bg-muted">
        <img
          src={report.imageUrl}
          alt="Animal"
          className="object-cover w-full h-full"
        />
        {isInjured && (
          <Badge variant="destructive" className="absolute top-3 right-3 shadow-md">
            🚨 Injured
          </Badge>
        )}
      </div>

      <CardHeader className="p-4 pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h3 className="font-bold text-xl capitalize">
              {report.analysisResult?.animalType || "Unknown Animal"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
            </p>
          </div>
          {severity && (
            <Badge
              variant={severity === "critical" ? "destructive" : severity === "medium" ? "default" : "secondary"}
              className="capitalize"
            >
              {severity}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3">
        {isInjured && (
          <div className="text-sm bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100 p-3 rounded-lg border border-red-200 dark:border-red-800">
            <p className="font-semibold mb-1">⚠️ Injury Details:</p>
            <p><strong>Condition:</strong> {report.analysisResult?.injuryDetails?.condition}</p>
            <p><strong>Environment:</strong> {report.analysisResult?.environment?.description}</p>
          </div>
        )}

        {report.latitude && report.longitude && (
          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              Location
            </div>
            <MapView
              lat={report.latitude}
              lng={report.longitude}
              popupText={report.location || "Report Location"}
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 border-t bg-muted/30 flex justify-between items-center gap-2">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            <span className="font-medium">{likesCount}</span>
          </Button>

          <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">{report.comments?.length || 0}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Comment</DialogTitle>
                <DialogDescription>
                  Share your thoughts or offer support for this {report.analysisResult?.animalType || "animal"}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="Write your comment here..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCommentDialogOpen(false)}
                  disabled={isSubmittingComment}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCommentSubmit}
                  disabled={isSubmittingComment || !commentText.trim()}
                  className="gap-2"
                >
                  {isSubmittingComment ? (
                    <>Posting...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Post Comment
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isAdmin ? (
          <Button size="sm" variant="default" className="font-medium">
            Update Status
          </Button>
        ) : (
          <Button
            size="sm"
            variant="default"
            onClick={handleDonate}
            className="bg-green-600 hover:bg-green-700 font-medium gap-1.5"
          >
            💚 Donate
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
