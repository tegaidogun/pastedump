import PasteView from "@/components/paste-view"

// This would normally fetch data from an API
const getMockPaste = (id: string) => {
  return {
    id,
    title: "Example TypeScript Function",
    content: `function calculateTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

// Example usage
const cartItems = [
  { price: 10, quantity: 2 },
  { price: 15, quantity: 1 },
  { price: 5, quantity: 4 }
];

const total = calculateTotal(cartItems);
console.log(\`Total: $\${total}\`); // Output: Total: $50`,
    createdAt: "2023-05-15T10:30:00Z",
    viewCount: 42,
    language: "typescript",
  }
}

export default function PastePage({ params }: { params: { id: string } }) {
  const paste = getMockPaste(params.id)

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <PasteView paste={paste} />
      </div>
    </div>
  )
}
