
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Twitter, Linkedin, Facebook, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RunwareService } from '@/lib/runware';

const MAX_CHARS = 280;

const SocialPostGenerator = () => {
  const [text, setText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      setText(e.target.value);
    }
  };

  const generatePost = async () => {
    if (!text) {
      toast.error('Please enter some text first');
      return;
    }

    if (!apiKey) {
      toast.error('Please enter your Runware API key');
      return;
    }

    setIsGenerating(true);

    try {
      const runware = new RunwareService(apiKey);
      const result = await runware.generateImage({
        positivePrompt: text,
        model: "runware:100@1",
        width: 1024,
        height: 1024
      });

      setImageUrl(result.imageURL);
      setGeneratedPost(text);
      toast.success('Post generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image. Please check your API key and try again.');
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(generatedPost)}&url=${encodeURIComponent(window.location.href)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(generatedPost)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-lg border border-gray-100">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Enter your Runware API key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your API key from runware.ai"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What's on your mind?
            </label>
            <Textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Enter your post content here..."
              className="min-h-[120px] resize-none"
            />
            <div className="text-sm text-gray-500 text-right">
              {text.length}/{MAX_CHARS}
            </div>
          </div>
          <Button
            onClick={generatePost}
            disabled={isGenerating || !text}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Post
              </>
            )}
          </Button>
        </div>
      </Card>

      {(imageUrl || isGenerating) && (
        <Card className={cn(
          "p-6 backdrop-blur-sm bg-white/80 shadow-lg border border-gray-100 transition-opacity duration-300",
          isGenerating ? "opacity-50" : "opacity-100"
        )}>
          <div className="space-y-4">
            {imageUrl && (
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt="Generated visual"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-gray-900 text-lg">{generatedPost}</p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none hover:bg-[#1DA1F2] hover:text-white transition-colors"
                asChild
              >
                <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="mr-2 h-4 w-4" />
                  Tweet
                </a>
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none hover:bg-[#0077B5] hover:text-white transition-colors"
                asChild
              >
                <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-4 w-4" />
                  Share
                </a>
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none hover:bg-[#4267B2] hover:text-white transition-colors"
                asChild
              >
                <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="mr-2 h-4 w-4" />
                  Post
                </a>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SocialPostGenerator;
