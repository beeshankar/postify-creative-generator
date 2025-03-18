
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Twitter, Linkedin, Facebook, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const MAX_CHARS = 280;
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80';

const SocialPostGenerator = () => {
  const [text, setText] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      setText(e.target.value);
    }
  };

  const generatePost = () => {
    if (!text) {
      toast.error('Please enter some text first');
      return;
    }

    setIsGenerating(true);
    
    // Simulate a brief loading state
    setTimeout(() => {
      setGeneratedPost(text);
      setIsGenerating(false);
      toast.success('Post generated successfully!');
    }, 500);
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-lg border border-gray-100">
        <div className="space-y-4">
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
              'Generate Post'
            )}
          </Button>
        </div>
      </Card>

      {generatedPost && (
        <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-lg border border-gray-100">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={PLACEHOLDER_IMAGE}
                alt="Placeholder"
                className="w-full h-full object-cover"
              />
            </div>
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
