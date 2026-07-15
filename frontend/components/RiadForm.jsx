"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Upload, MapPin, DollarSign, Image as ImageIcon, Type } from "lucide-react";
import { riadService } from "@/services";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().min(1, "Description is required"),
  pricePerNight: z.coerce.number().positive("Price must be greater than zero"),
  imageUrl: z.string().url("Invalid image URL"),
});

export default function RiadForm({ initial }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initial || {
      name: "",
      city: "",
      address: "",
      description: "",
      pricePerNight: "",
      imageUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values) =>
      initial ? riadService.update(initial.id, values) : riadService.create(values),
    onSuccess: () => router.push("/admin/riads"),
  });

  const fields = [
    { name: "name", label: "Name", icon: Type, type: "text" },
    { name: "city", label: "City", icon: MapPin, type: "text" },
    { name: "address", label: "Address", icon: MapPin, type: "text" },
    { name: "imageUrl", label: "Image URL", icon: ImageIcon, type: "text" },
  ];

  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent>
        {mutation.isError && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {mutation.error.response?.data?.error || "Save failed."}
          </div>
        )}
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <Label>{f.label}</Label>
              <Input icon={f.icon} type={f.type} {...register(f.name)} />
              {errors[f.name] && (
                <p className="mt-1 text-sm text-danger">{errors[f.name].message}</p>
              )}
            </div>
          ))}

          <div>
            <Label>Price per night (MAD)</Label>
            <Input icon={DollarSign} type="number" step="0.01" {...register("pricePerNight")} />
            {errors.pricePerNight && (
              <p className="mt-1 text-sm text-danger">{errors.pricePerNight.message}</p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              rows={4}
              {...register("description")}
              className="input-base min-h-28 resize-y"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => router.push("/admin/riads")}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : (
                <>
                  <Upload className="h-4 w-4" /> Save Riad
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
