import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Icon from '@/components/ui/icon';

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
  features: string[];
  rating: number;
  reviews: number;
  size: number;
  guests: number;
  beds: number;
  description?: string;
  gallery?: string[];
  amenities?: string[];
}

interface RoomDetailsProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (room: Room) => void;
}

const defaultGallery = [
  '/img/bd367f9f-5923-4469-8775-f266a80f5447.jpg',
  '/img/312ed3a0-425a-4550-a3e5-37c1ce1db9d9.jpg',
  '/img/73eb5b79-edef-4dd4-8147-ff30b52c0765.jpg'
];

const defaultAmenities = [
  { name: 'Бесплатный Wi-Fi', icon: 'Wifi' },
  { name: 'Кондиционер', icon: 'Wind' },
  { name: 'Телевизор', icon: 'Tv' },
  { name: 'Мини-бар', icon: 'Coffee' },
  { name: 'Сейф', icon: 'Shield' },
  { name: 'Фен', icon: 'Zap' },
  { name: 'Халаты', icon: 'Shirt' },
  { name: 'Тапочки', icon: 'Footprints' }
];

export default function RoomDetails({ room, isOpen, onClose, onBook }: RoomDetailsProps) {
  if (!room) return null;

  const roomAmenities = room.amenities || defaultAmenities.map(a => a.name);
  const roomGallery = room.gallery || defaultGallery;
  const description = room.description || `${room.name} - это идеальное место для комфортного отдыха. Номер оборудован всем необходимым для приятного пребывания. Современный дизайн сочетается с уютной атмосферой, создавая неповторимое ощущение домашнего комфорта.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{room.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gallery */}
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {roomGallery.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={image}
                      alt={`${room.name} - фото ${index + 1}`}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            {/* Room Info */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-hotel-accent text-white">{room.type}</Badge>
                <div className="flex items-center">
                  <Icon name="Star" className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{room.rating}</span>
                  <span className="text-hotel-gray ml-1">({room.reviews} отзывов)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Icon name="Users" className="w-6 h-6 text-hotel-gray mb-1" />
                  <span className="text-sm font-medium">{room.guests} гостя</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Icon name="Bed" className="w-6 h-6 text-hotel-gray mb-1" />
                  <span className="text-sm font-medium">{room.beds} кровать</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Icon name="Square" className="w-6 h-6 text-hotel-gray mb-1" />
                  <span className="text-sm font-medium">{room.size} м²</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Описание</h4>
                <p className="text-hotel-gray text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          </div>

          {/* Booking & Amenities */}
          <div className="space-y-6">
            {/* Price & Booking */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-3xl text-primary">
                      {room.price.toLocaleString()} ₽
                    </CardTitle>
                    <CardDescription>за ночь</CardDescription>
                  </div>
                  <Button 
                    onClick={() => onBook(room)}
                    className="bg-primary hover:bg-primary-600 px-8"
                  >
                    <Icon name="Calendar" className="w-4 h-4 mr-2" />
                    Забронировать
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Удобства номера</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {roomAmenities.slice(0, 8).map((amenity, index) => {
                    const amenityData = defaultAmenities.find(a => a.name === amenity) || 
                                      { name: amenity, icon: 'Check' };
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon name={amenityData.icon as any} className="w-4 h-4 text-hotel-gray" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Additional Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Включено в стоимость</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="Wifi" className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Бесплатный Wi-Fi</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Car" className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Парковка</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Utensils" className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Завтрак (по запросу)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Phone" className="w-4 h-4 text-green-600" />
                    <span className="text-sm">24/7 поддержка</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Условия бронирования</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-hotel-gray">
                  <p>• Бесплатная отмена до 24 часов до заезда</p>
                  <p>• Заезд: с 14:00</p>
                  <p>• Выезд: до 12:00</p>
                  <p>• Предоплата: 30% от стоимости</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}