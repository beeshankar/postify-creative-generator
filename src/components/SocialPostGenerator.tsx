
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Twitter, Linkedin, Facebook, Instagram, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const MAX_CHARS = 280;
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80';

const SocialPostGenerator = () => {
  const [text, setText] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [editablePost, setEditablePost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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

    setIsGenerating(true);

    try {
      const response = await fetch('https://free.churchless.tech/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a social media content writer. Take the user\'s input and create an engaging, extended post that maintains the original message while being more engaging. Keep it concise and appropriate for social media.'
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      const generatedContent = data.choices[0].message.content;
      setGeneratedPost(generatedContent);
      setEditablePost(generatedContent);
      setShowPreview(true);
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content. Please try again later.');
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    setGeneratedPost(editablePost);
    toast.success('Content ready to share!');
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(generatedPost)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(generatedPost)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    instagram: '#' // Note: Instagram doesn't support direct sharing via URL
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

      {showPreview && (
        <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-lg border border-gray-100">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Edit Generated Content
            </label>
            <Textarea
              value={editablePost}
              onChange={(e) => setEditablePost(e.target.value)}
              className="min-h-[200px]"
            />
            <Button onClick={handlePublish} className="w-full">
              Preview & Publish
            </Button>
          </div>
        </Card>
      )}

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
              <Button
                variant="outline"
                className="flex-1 sm:flex-none hover:bg-[#E4405F] hover:text-white transition-colors"
                onClick={() => toast.info('Instagram sharing requires the Instagram app. Copy the text and share manually.')}
              >
                <Instagram className="mr-2 h-4 w-4" />
                Copy for Instagram
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SocialPostGenerator;
