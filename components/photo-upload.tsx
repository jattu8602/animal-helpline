"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { v4 as uuidv4 } from "uuid";
import { Camera, Upload, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PhotoUpload() {
    const [deviceId, setDeviceId] = useState<string>("");
    const [image, setImage] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Initialize device ID
        let id = localStorage.getItem("animal_helpline_device_id");
        if (!id) {
            id = uuidv4();
            localStorage.setItem("animal_helpline_device_id", id);
        }
        setDeviceId(id);
    }, []);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImage(imageSrc);
            setIsCameraOpen(false);
        }
    }, [webcamRef]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = async () => {
        if (!image) return;

        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);

        try {
            // 1. Upload to Cloudinary
            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image }),
            });

            if (!uploadRes.ok) throw new Error("Failed to upload image");
            const { url: imageUrl } = await uploadRes.json();

            // 2. Analyze with AI
            const analyzeRes = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: imageUrl }), // Sending URL to OpenAI is faster/cheaper than base64 sometimes, but here we send URL
            });

            if (!analyzeRes.ok) throw new Error("Failed to analyze image");
            const analysis = await analyzeRes.json();
            setAnalysisResult(analysis);

            // 3. Submit Report
            const reportRes = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    deviceId,
                    imageUrl,
                    analysisResult: analysis,
                    location: "Unknown", // TODO: Get geolocation
                }),
            });

            if (!reportRes.ok) console.error("Failed to save report");

        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const reset = () => {
        setImage(null);
        setAnalysisResult(null);
        setError(null);
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Report Injured Animal</CardTitle>
                    <CardDescription>Take a photo or upload to analyze.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!image ? (
                        <div className="space-y-4">
                            {isCameraOpen ? (
                                <div className="relative rounded-lg overflow-hidden bg-black">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full"
                                        videoConstraints={{ facingMode: "environment" }}
                                    />
                                    <Button
                                        onClick={capture}
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full w-16 h-16 p-0 bg-white hover:bg-gray-200 text-black border-4 border-gray-300"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-red-500" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-white hover:bg-black/50"
                                        onClick={() => setIsCameraOpen(false)}
                                    >
                                        <X className="h-6 w-6" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-32 flex flex-col items-center justify-center gap-2 border-dashed"
                                        onClick={() => setIsCameraOpen(true)}
                                    >
                                        <Camera className="h-8 w-8 text-muted-foreground" />
                                        <span>Open Camera</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-32 flex flex-col items-center justify-center gap-2 border-dashed"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <span>Upload Photo</span>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative rounded-lg overflow-hidden border">
                                <img src={image} alt="Preview" className="w-full object-cover max-h-[400px]" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 rounded-full"
                                    onClick={reset}
                                    disabled={isAnalyzing}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {!analysisResult && (
                                <Button
                                    className="w-full"
                                    onClick={analyzeImage}
                                    disabled={isAnalyzing}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        "Analyze Image"
                                    )}
                                </Button>
                            )}
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {analysisResult && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <Alert variant={analysisResult.isInjured ? "destructive" : "default"}>
                                {analysisResult.isInjured ? (
                                    <AlertCircle className="h-4 w-4" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                )}
                                <AlertTitle>
                                    {analysisResult.isAnimal
                                        ? `Animal Detected: ${analysisResult.animalType || "Unknown"}`
                                        : "No Animal Detected"}
                                </AlertTitle>
                                <AlertDescription>
                                    {analysisResult.isInjured
                                        ? "This animal appears to be injured."
                                        : "No visible injuries detected."}
                                </AlertDescription>
                            </Alert>

                            {analysisResult.isInjured && (
                                <div className="space-y-2 text-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="font-semibold">Condition:</div>
                                        <div>{analysisResult.injuryDetails?.condition}</div>
                                        <div className="font-semibold">Severity:</div>
                                        <div className="capitalize">{analysisResult.injuryDetails?.severity}</div>
                                        <div className="font-semibold">Environment:</div>
                                        <div>{analysisResult.environment?.description}</div>
                                    </div>
                                    <div className="bg-muted p-3 rounded-md">
                                        <div className="font-semibold mb-1">Recommendations:</div>
                                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                            {analysisResult.recommendations?.map((rec: string, i: number) => (
                                                <li key={i}>{rec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}