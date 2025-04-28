import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from "react-native";
import styles from "../../../../styles/profile/productsStyles";
import { globalStyles } from "@/styles/globalStyles";
import CustomButton from "@/components/customButton";
import EditableCard from "@/components/editableCard";
import { Colors } from "@/constants/Colors";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxDispatch";
import { openModal } from "@/redux/slices/activeModalSlice";
import ModalForm from "@/components/modals/modalForm";
import NewProductModalContent from "@/components/modalContents/contents/newProduct";
import { 
  getProduct, 
  getSellerProducts,
  editProduct, 
  deleteProduct, 
  getApprovedOperatorsAndProducts 
} from "@/api/userApi";
import { Product } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useToastMessage } from "@/hooks/useToastMessage";
import { MaterialIcons } from "@expo/vector-icons";

type OperatorWithProducts = {
  id: string;
  name: string;
  products: Product[];
};

const Products = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.activeModal.activeModal);
  const user = useAppSelector((state) => state.auth.user);
  const { showError, showSuccess } = useToastMessage();

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [approvedOperators, setApprovedOperators] = useState<OperatorWithProducts[]>([]);
  const [expandedOperators, setExpandedOperators] = useState<Record<string, boolean>>({});
  const [isMyProductsExpanded, setIsMyProductsExpanded] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMyProducts = async () => {
    try {
      setIsLoading(true);
      // Role göre doğru API çağrısını yapıyoruz
      const productData: Product[] = user?.role === "seller" 
        ? await getSellerProducts() 
        : await getProduct();
      
      setMyProducts(productData);
    } catch (error) {
      console.error("Ürün bilgileri alınamadı:", error);
      showError("Ürünleriniz yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApprovedOperators = async () => {
    try {
      setIsLoading(true);
      const operatorsData: OperatorWithProducts[] = await getApprovedOperatorsAndProducts();
      setApprovedOperators(operatorsData || []);
      // Initialize all operators as collapsed
      const initialExpandState: Record<string, boolean> = {};
      operatorsData?.forEach(op => {
        initialExpandState[op.id] = false;
      });
      setExpandedOperators(initialExpandState);
    } catch (error) {
      console.error("Onaylı operatörler alınamadı:", error);
      showError("Operatör bilgileri yüklenirken bir hata oluştu");
      setApprovedOperators([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Her kullanıcı (seller veya operator) kendi ürünlerini görebilmeli
    fetchMyProducts(); 
    
    // Eğer seller rolüne sahipse, anlaşmalı operatörlerin ürünlerini de getir
    if (user?.role === "seller") {
      fetchApprovedOperators();
    }
  }, [user?.role]);

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    dispatch(openModal("newProduct"));
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    dispatch(openModal("newProduct"));
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      setIsLoading(true);
      await deleteProduct(product.id);
      showSuccess("Ürün başarıyla silindi");
      // Ürün silindikten sonra listeyi güncelle
      fetchMyProducts();
    } catch (error) {
      console.error("Ürün silme hatası:", error);
      showError("Ürün silinirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOperator = (operatorId: string) => {
    setExpandedOperators(prev => ({
      ...prev,
      [operatorId]: !prev[operatorId]
    }));
  };

  const toggleMyProducts = () => {
    setIsMyProductsExpanded(!isMyProductsExpanded);
  };

  const renderMyProducts = () => {
    return (
      <View style={styles.operatorContainer}>
        <TouchableOpacity 
          style={styles.operatorHeader} 
          onPress={toggleMyProducts}
        >
          <Text style={styles.operatorName}>My Products</Text>
          <Ionicons 
            name={isMyProductsExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color={Colors.light.text} 
          />
        </TouchableOpacity>
        
        {isMyProductsExpanded && (
          <View style={styles.productsContainer}>
            {myProducts.length === 0 ? (
              <Text style={styles.noProductsText}>You haven't created any products yet</Text>
            ) : (
              myProducts.map((product) => (
                <View key={product.id} style={styles.productItemWrapper}>
                  <EditableCard
                    value={product.name}
                    onPress={() => handleEditProduct(product)}
                    isDelete={false}
                    showEditIcon={true}
                    style={{flex: 1}}
                  />
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteProduct(product)}
                  >
                    <MaterialIcons name="delete" size={20} color={Colors.light.icon} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </View>
    );
  };

  const renderApprovedOperators = () => {
    if (!approvedOperators || approvedOperators.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={globalStyles.noDataMessage}>No approved operators found</Text>
          <Text style={styles.emptyStateSubtext}>
            You need to connect with operators first. Operators will appear here after your connection requests are approved.
          </Text>
        </View>
      );
    }

    return (
      <>
        <Text style={styles.sectionTitle}>Operator Products</Text>
        {approvedOperators.map((operator) => (
          <View key={operator.id} style={styles.operatorContainer}>
            <TouchableOpacity 
              style={styles.operatorHeader} 
              onPress={() => toggleOperator(operator.id)}
            >
              <Text style={styles.operatorName}>{operator.name}</Text>
              <Ionicons 
                name={expandedOperators[operator.id] ? "chevron-up" : "chevron-down"} 
                size={24} 
                color={Colors.light.text} 
              />
            </TouchableOpacity>
            
            {expandedOperators[operator.id] && (
              <View style={styles.productsContainer}>
                {!operator.products || operator.products.length === 0 ? (
                  <Text style={styles.noProductsText}>No products available from this operator</Text>
                ) : (
                  operator.products.map((product) => (
                    <EditableCard
                      key={product.id}
                      value={`${product.name} (${product.startTime})`}
                      onPress={() => {/* View only, no edit */}}
                      isDelete={false}
                      showEditIcon={false}
                    />
                  ))
                )}
              </View>
            )}
          </View>
        ))}
      </>
    );
  };

  const renderSellerView = () => {
    return (
      <>
        {renderMyProducts()}
        {renderApprovedOperators()}
      </>
    );
  };

  const renderOperatorView = () => {
    return renderMyProducts();
  };

  return (
    <SafeAreaView style={globalStyles.pageContainer}>
      {(user?.role === "operator" || user?.role === "seller") && (
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Add New Product"
            onPress={handleAddNewProduct}
            backgroundColor={Colors.light.primary}
            iconName="plus"
            size="small"
          />
        </View>
      )}
      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {user?.role === "seller" ? renderSellerView() : renderOperatorView()}
        </View>
      </ScrollView>
      <ModalForm title="New Product" visible={activeModal === "newProduct"}>
        <NewProductModalContent
          selectedProduct={selectedProduct}
          onSuccess={() => {
            fetchMyProducts();
            if (user?.role === "seller") {
              fetchApprovedOperators();
            }
          }}
        />
      </ModalForm>
    </SafeAreaView>
  );
};

export default Products;
