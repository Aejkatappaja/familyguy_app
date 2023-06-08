import { Container } from "@/components/Container";
import { getAllCharacters } from "@/lib/character";
import { Character } from "@/types/Character";
import { Qoutes } from "@/types/Qoutes";
import { endpoint } from "@/utils/endpoint";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Image from "next/image";

export const dynamicParams = false;

export async function generateStaticParams() {
  const data = await getAllCharacters();
  return data.map((character: Character) => ({ slug: character.slug }));
}

export async function getCharacterBySlug(slug: string) {
  const data = await fetch(`${endpoint}/characters/${slug}`);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
}

export default async function Page({ params }: Params) {
  const { character, character_qoutes } = await getCharacterBySlug(params.slug);

  return (
    <Container as="main" className="flex flex-col gap-5 py-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold capitalize">{character.name}</h1>
        <ul className="flex gap-1 text-sm">
          {character.occupations.map((item: string) => {
            return (
              <li
                key={item}
                className="p-2 text-gray-300 bg-gray-800 rounded-md"
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>
      <p className="text-sm leading-6">{character.description}</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {character.images.map((image: string) => {
          return (
            <li
              key={image}
              className="relative flex overflow-hidden bg-gray-900 rounded-xl"
            >
              <Image
                className="transition-all duration-500 hover:scale-110 hover:rotate-2"
                src={image}
                alt=""
                width={760}
                height={435}
              />
            </li>
          );
        })}
      </ul>
      {character.skills && (
        <>
          <h2 className="text-xl font-bold">Power and Skills</h2>
          <ul className="flex flex-wrap gap-1">
            {character.skills.map((item: string) => {
              return (
                <li
                  className="flex justify-center flex-grow px-2 py-1 text-orange-400 rounded-full bg-orange-950"
                  key={item}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        </>
      )}
      {character_qoutes && (
        <>
          <h2 className="text-xl font-bold">Famous Qoutes</h2>
          <ul className="grid gap-5">
            {character_qoutes.map((item: Qoutes, idx: number) => {
              return (
                <li
                  className="p-2 italic text-gray-400 border-l-4 border-green-400 rounded-md"
                  key={idx}
                >
                  {item.qoute}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Container>
  );
}
