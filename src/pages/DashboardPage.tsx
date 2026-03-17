import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { electronService, BoilerplateItem } from '@/services/electron.service';
import { Trash2, Plus, RefreshCw, Box } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [items, setItems] = useState<BoilerplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newItem, setNewItem] = useState<Partial<BoilerplateItem>>({
    label: '',
    value: '',
    description: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await electronService.getItems();
    setItems(data);
    setLoading(false);
  };

  const handleRemove = async (id: string) => {
    const newList = items.filter(i => i.id !== id);
    await electronService.updateItems(newList);
    setItems(newList);
  };

  const handleAdd = async () => {
    if (!newItem.label || !newItem.value) return;
    
    const item: BoilerplateItem = {
      id: Math.random().toString(36).substr(2, 9),
      label: newItem.label,
      value: newItem.value,
      description: newItem.description,
      timestamp: Date.now()
    };
    
    const newList = [...items, item];
    await electronService.updateItems(newList);
    setItems(newList);
    setShowAddForm(false);
    setNewItem({
      label: '',
      value: '',
      description: ''
    });
  };

  return (
    <div className="flex flex-col h-full bg-background/30 p-4 space-y-4 max-w-lg mx-auto">
      {/* Header with Quick Add */}
      {!showAddForm && (
        <div className="flex justify-between items-center bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-foreground">Dashboard</h2>
            <p className="text-xs text-muted-foreground">{items.length} items stored</p>
          </div>
          <Button 
            size="sm" 
            className="rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </Button>
        </div>
      )}

      {showAddForm && (
        <Card className="border-primary/20 bg-card/80 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              New Boilerplate Item
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Label"
                value={newItem.label}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                placeholder="Item Label"
              />
              <Input
                label="Value"
                value={newItem.value}
                onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                placeholder="Item Value"
              />
            </div>
            <Input
              label="Description (Optional)"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Short description..."
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button size="sm" onClick={handleAdd}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {items.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4 bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Box className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No items yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add your first item to see how storage works</p>
            </div>
          </div>
        )}
        
        {items.map((item) => (
          <Card key={item.id} className="group hover:border-primary/50 transition-colors shadow-sm bg-card/40 backdrop-blur-[2px]">
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-bold text-xs uppercase">
                    {item.label.substring(0, 2)}
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                      {item.description || 'No description provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted" onClick={loadItems}>
                    <RefreshCw className={loading ? "w-3 h-3 animate-spin" : "w-3 h-3"} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 text-[12px] bg-accent/30 p-2 rounded-lg border border-border/50">
                <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider block mb-0.5">Stored Value</span>
                <span className="font-mono">{item.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
