export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LearnFlow. All rights reserved.</p>
        <p className="mt-1">Empowering learners, one course at a time.</p>
      </div>
    </footer>
  );
}
