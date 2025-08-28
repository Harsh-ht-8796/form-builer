"use client";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProfileNotActivated: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Profile Not Active</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Please activate your profile first.
                    </p>
          
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileNotActivated;