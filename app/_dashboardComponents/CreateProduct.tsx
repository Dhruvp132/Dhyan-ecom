"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ImageUpload from "../components/ImageUploader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch } from "@/providers/toolkit/hooks/hooks";
import { CreatePro } from "@/providers/toolkit/features/CreateProductSlice";
import { useSession } from "next-auth/react";
import { Save } from "lucide-react";

interface Size {
  size: string[];
}

interface Color {
  color: { color: string; colorCode: string }[];
}

interface FormData {
  name: string;
  description: string;
  category: string;
  price: number;
  selectedSizes: string[];
  selectedColors: string[];
  image: string;
  images: string;
}

interface Session {
  user?: {
    id: string;
  };
}

const CreateProduct = () => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showSizes, setShowSizes] = useState<boolean>(false);
  const [showColors, setShowColors] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [mainImageUrl, setMainImageUrl] = useState<string[]>([]);
  const [otherImageUrls, setOtherImageUrls] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const { data: session } = useSession() as { data: Session };

  const sizes: Size = {
    size: ["S", "M", "L", "XL", "XXL"],
  };

  const colors: Color = {
    color: [
      { color: "Red", colorCode: "#FF0000" },
      { color: "Green", colorCode: "#008000" },
      { color: "Blue", colorCode: "#0000FF" },
      { color: "Yellow", colorCode: "#FFFF00" },
      { color: "Black", colorCode: "#000000" },
      { color: "White", colorCode: "#FFFFFF" },
    ],
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const handleSizeSelection = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorSelection = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    dispatch(
      CreatePro({
        name: data.name,
        price: parseInt(data.price.toString()),
        description: data.description,
        mainImage: mainImageUrl,
        otherImages: otherImageUrls,
        userId: session?.user?.id as string,
        categories: category,
        sizes: selectedSizes,
        colors: selectedColors,
      })
    );
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center p-5 flex-col bg-gray-200 relative"
    >
      <h1 className="text-2xl font-semibold text-start w-full my-5">
        Create Product
      </h1>
      <div className="w-full flex justify-end my-5 sticky top-40">
        <CardContent>
          <Button type="submit" size="sm" className="h-8 gap-1 ">
            <Save className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Save Product
            </span>
          </Button>
        </CardContent>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Fill in the details of the product you want to create.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                placeholder="Enter product name"
                {...register("name", { required: true })}
              />
              {errors.name && <p className="text-red-500">Name is required.</p>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="min-h-32"
                placeholder="Enter product description"
                {...register("description", { required: true })}
              />
              {errors.description && (
                <p className="text-red-500">Description is required.</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="grid gap-3">
              <Label htmlFor="category">Category</Label>
              <Select
                {...register("category")}
                onValueChange={(value) => setCategory(value)}
              >
                <SelectTrigger id="category" aria-label="Select category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="man">Man</SelectItem>
                  <SelectItem value="woman">Woman</SelectItem>
                  <SelectItem value="children">Children</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500">Category is required.</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="size">Size</Label>
              <div className="flex items-center justify-start gap-2 w-full">
                <RadioGroup
                  defaultValue="no"
                  onValueChange={(value) => setShowSizes(value === "yes")}
                  className="flex items-center justify-start gap-2 w-full"
                >
                  <RadioGroupItem value="no" id="size-no" />
                  <Label htmlFor="size-no">No</Label>

                  <RadioGroupItem value="yes" id="size-yes" />
                  <Label htmlFor="size-yes">Yes</Label>
                </RadioGroup>
              </div>
              {showSizes && (
                <div className="flex gap-2 md:gap-3 items-center justify-center flex-wrap">
                  {sizes.size.map((size) => (
                    <div key={size} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        value={size}
                        onChange={() => handleSizeSelection(size)}
                        checked={selectedSizes.includes(size)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`size-${size}`} className="text-sm">
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="grid gap-3">
              <Label htmlFor="price">
                Price
                <span className="text-gray-500 text-sm"> (in INR)</span>
              </Label>
              <Input
                id="price"
                type="number"
                className="w-full"
                placeholder="Enter product price"
                {...register("price", { required: true })}
              />
              {errors.price && (
                <p className="text-red-500">Price is required.</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center justify-start gap-2 w-full">
                <RadioGroup
                  defaultValue="no"
                  onValueChange={(value) => setShowColors(value === "yes")}
                  className="flex items-center justify-start gap-2 w-full"
                >
                  <RadioGroupItem value="no" id="color-no" />
                  <Label htmlFor="color-no">No</Label>

                  <RadioGroupItem value="yes" id="color-yes" />
                  <Label htmlFor="color-yes">Yes</Label>
                </RadioGroup>
              </div>
              {showColors && (
                <div className="flex items-center gap-2 justify-center flex-wrap">
                  {colors.color.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`color-${color.color}`}
                        value={color.color}
                        onChange={() => handleColorSelection(color.color)}
                        checked={selectedColors.includes(color.color)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span
                        style={{
                          display: "inline-block",
                          width: "15px",
                          height: "15px",
                          borderRadius: "50%",
                          border: "1px solid #000",
                          backgroundColor: color.colorCode,
                        }}
                      ></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardContent>
          <div className="grid gap-3">
            <Label htmlFor="image">
              Main Image
              <span className="text-gray-500 text-sm"> (4MB max)</span>
            </Label>
            <ImageUpload
              url={(res) => {
                setMainImageUrl(res);
              }}
            />
            {errors.image && (
              <p className="text-red-500">Main Image is required.</p>
            )}
          </div>
        </CardContent>
        <CardContent>
          <div className="grid gap-3">
            <Label htmlFor="images">
              Other Images
              <span className="text-gray-500 text-sm"> (4MB max)</span>
            </Label>
            <ImageUpload
              url={(res) => {
                console.log("res", res);
                setOtherImageUrls(res);
              }}
            />
            {errors.images && (
              <p className="text-red-500">Other Images are required.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default CreateProduct;
