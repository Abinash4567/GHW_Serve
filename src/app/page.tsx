"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface IMeal {
  name?: string,
  url?: string
}

interface Idata {
  name: string,
  url: string
}

import { ModeToggle } from "@/components/common/dark";
import { Shuffle } from "lucide-react";
import { use, useEffect, useState } from "react"
import Image from "next/image"
import { Item } from "@radix-ui/react-select"

export default function Home() {
  const [showData, setShowData] = useState<Array<IMeal>>([{}]);
  const [category, setCategory] = useState<string[]>([]);
  const [area, setArea] = useState<string[]>([]);
  const [ing, setIng] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(false);

  function findIntersection(arr1: Array<Idata>, arr2: Array<Idata>, arr3: Array<Idata>) {
    const nonEmptyArrays = [arr1, arr2, arr3].filter(arr => arr.length > 0);

    if (nonEmptyArrays.length === 0) {
        return [];
    }

    const intersection = [];

    const [firstArray, ...restArrays] = nonEmptyArrays;

    for (const item of firstArray) {
        const { name, url } = item;
        const isPresentInRestArrays = restArrays.every(arr => arr.some(({ name: n, url: u }) => name === n && url === u));
        if (isPresentInRestArrays) {
            intersection.push({ name, url });
        }
    }

    return intersection;
  }

  async function load() {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const json = await data.json();
    setShowData([{ name: json.meals[0].strMeal, url: json.meals[0].strMealThumb }]);
    // console.log(json.meals[0].strMeal);
    // console.log(json.meals[0].strMealThumb);
  }
  useEffect(() => {
    load();
    async function reboot(){
      const cdata = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?c=list`);
      const cres = await cdata.json();
      const carr = cres?.meals;
      // console.log(carr);
      let arr = [];
      for (let item of carr)
        arr.push(item?.strCategory);
      setCategory(arr);

      const adata = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
      const ares = await adata.json();
      const aarr = ares?.meals;
      // console.log(aarr);
      arr = [];
      for (let item of aarr)
        arr.push(item?.strArea);
      setArea(arr);
      // console.log(arr);

      const idata = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
      const ires = await idata.json();
      const iarr = ires?.meals;
      arr = [];
      for (let item of iarr)
        arr.push(item?.strIngredient);
      setIng(arr);
    }
    reboot();
    // console.log(arr);
  }, []);




  const FormSchema = z.object({
    category: z.optional(z.string()),
    ingredient: z.optional(z.string()),
    area: z.optional(z.string())
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setShow(false);

    let cat = data.category;
    let ing = data.ingredient;
    let area = data.area;

    let catArr = [];
    let ingArr = [];
    let areaArr = [];

    if (cat !== undefined) {
      let dat = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
      let res = await dat.json();
      let resArr = res.meals;
      for (let item of resArr) {
        let obj: { name: string, url: string } = {
          name: "",
          url: ""
        };
        Object.assign(obj, { name: item.strMeal, url: item.strMealThumb })
        obj.name = item?.strMeal;
        obj.url = item?.strMealThumb;
        catArr.push(obj);
      }
    }

    if (ing !== undefined) {
      let dat = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`);
      let res = await dat.json();
      let resArr = res.meals;
      for (let item of resArr) {
        let obj: { name: string, url: string } = {
          name: "",
          url: ""
        };
        Object.assign(obj, { name: item.strMeal, url: item.strMealThumb })
        obj.name = item?.strMeal;
        obj.url = item?.strMealThumb;
        ingArr.push(obj);
      }
    }

    if (area !== undefined) {
      let dat = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
      let res = await dat.json();
      let resArr = res.meals;
      for (let item of resArr) {
        let obj: { name: string, url: string } = {
          name: "",
          url: ""
        };
        Object.assign(obj, { name: item.strMeal, url: item.strMealThumb })
        obj.name = item?.strMeal;
        obj.url = item?.strMealThumb;
        areaArr.push(obj);
      }
    }

    const ans = findIntersection(catArr, ingArr, areaArr);

    // console.log(catArr);
    // console.log(ingArr);
    // console.log(areaArr);
    // console.log(ans);
    setShowData(ans);
    setShow(true);
  }


  return (
    <div className="ml-24 mt-3 w-10/12">

      <div className="flex justify-between">

        <div className="mb-4 text-4xl font-extrabold leading-none tracking-tight bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
          Serve
        </div>

        <ModeToggle />

      </div>

      <div className="ml-32 mt-16">
        <div className="mb-4 text-6xl font-extrabold leading-none tracking-tight">
          Foodie? We&apos;ve Got Your Feast.
        </div>
        <div className="mb-6 text-xl font-normal text-gray-500">
          Because &apos;What Should I Eat?&apos; Shouldn&apos;t Be a Question.
          Uncover Hidden Gems &amp; Culinary Delights.
        </div>
      </div>


      <div className="grid justify-items-stretch">

        <div className="grid grid-flow-col justify-stretch">
          <div>
            <div className="flex justify-between">
              <div className="text-xl font-bold leading-none tracking-tight text-slate-500 mr-96">Something Special</div>
              <Shuffle onClick={() => load()} className='w-12 h-12 rounded-full p-2 cursor-pointer mr-4 hover:bg-slate-700 transition ease-in-out duration-200' size={28} strokeWidth={2.25} />
            </div>
            {showData[0].name && <div className="text-2xl text-foreground">{showData[0].name}</div>}
            {showData[0].url &&
              <Image
                src={showData[0].url}
                alt="Picture of the food"
                width={500}
                height={500}
              />}
        </div>

        <div className="basis-1/2 ml-6 w-max">
          <div className="text-3xl font-extrabold leading-none tracking-tight mb-2">Your&apos;s Choice</div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

              <>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select from various categories to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {category &&
                            category.map((cati, index) => (
                              <SelectItem key={index} value={cati}>
                                {cati}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select from various Areas to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {area &&
                            area.map((cati, index) => (
                              <SelectItem key={index} value={cati}>
                                {cati}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ingredient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredient</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select from various Ingredients to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ing &&
                            ing.map((cati, index) => (
                              <SelectItem key={index} value={cati}>
                                {cati}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />


              </>

              <FormDescription>
                You can leave field empty if you don&apos;t want to filter by that field or getting less response.
              </FormDescription>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>

      </div>
    </div>
    {show && 
      <div className="grid grid-cols-3 gap-2">
          {showData.map((item, index)=>(
          <div key={index}>
            <div className="text-2xl font-extrabold leading-none tracking-tight">{item?.name}</div>
            <div className="rounded-xl overflow-hidden m-3">
            {item.url && <Image
                src={item.url}
                alt="Picture of the food"
                width={500}
                height={500}
              />}
            </div>
          </div>))}
      </div>
      
    }
    </div>

  )
}