
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, role, avatar, rating }) => {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          ))}
          {Array.from({ length: 5 - rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 text-gray-300" />
          ))}
        </div>
        
        <p className="text-gray-700 mb-6 italic">"{quote}"</p>
        
        <div className="flex items-center">
          <img 
            src={avatar} 
            alt={author}
            className="w-12 h-12 rounded-full object-cover mr-4" 
          />
          <div>
            <p className="font-semibold text-gray-900">{author}</p>
            <p className="text-gray-500 text-sm">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "TaleCloud has transformed my writing process. I use it to overcome writer's block and get inspiration for my novels. The illustrations are phenomenal!",
      author: "Emma Johnson",
      role: "Fiction Author",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      rating: 5,
    },
    {
      quote: "As a teacher, I use TaleCloud to create engaging stories for my elementary students. The audio narration feature is especially useful for my classroom.",
      author: "Michael Chen",
      role: "Elementary Teacher",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      rating: 4,
    },
    {
      quote: "The quality of the AI-generated stories is remarkable. I've used many similar tools, but TaleCloud produces the most coherent and creative narratives by far.",
      author: "Sarah Williams",
      role: "Content Creator",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-tale-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Join thousands of writers, educators, and storytellers using TaleCloud
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
